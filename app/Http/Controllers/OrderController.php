<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Salon;
use App\Models\User;
use App\Models\Product;
use App\Models\Customer;
use App\Models\SalonRole;
use App\Notifications\OrderNotification;
use App\Notifications\OrderProductNotification;
use App\Http\Requests\StoreOrderRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Exception;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render(
            'orders/Index.jsx',
            [
                ['orders' => $this->transformOrder()],
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        $productsRequest = $request->input('products');
        foreach ($productsRequest as $productId => $quantityRequest) {
            $product = DB::table('products')
                ->where('id', $productId)
                ->first();

            if ($product->quantity < $quantityRequest) {
                return redirect()->back()->withErrors(
                    [
                        'store' => __('Warning-Product-Quantity-Run-Out-Description', [
                            'ProductName' => $product->name,
                            'QuantityProduct' => $product->quantity,
                        ]),
                    ]
                );
            }
        }

        $order_status = collect(config('app.order_status'));
        $prepare_id = $order_status->search('Prepare');

        try {
            DB::transaction(
                function () use ($validated, $request, $prepare_id) {
                    if ($validated['customerId'] > -1) {
                        $lastInsertedOrderId = DB::table('orders')->insertGetId(
                            [
                                'customer_id' => $validated['customerId'],
                                'salon_id' => $validated['salonId'],
                                'status' => $prepare_id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]
                        );
                    } else {
                        $lastInsertedOrderId = DB::table('orders')->insertGetId(
                            [
                                'salon_id' => $validated['salonId'],
                                'status' => $prepare_id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]
                        );
                    }

                    $data = [];

                    $products = $request->input('products');

                    foreach ($products as $productId => $quantity) {
                        $data[] = [
                            'order_id' => $lastInsertedOrderId,
                            'product_id' => $productId,
                            'quantity' => $quantity,
                            'status' => $prepare_id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }

                    DB::table('order_product')->insert($data);
                },
                config('database.connections.mysql.max_attempts')
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'store' => __('there was an error'),
                ]
            );
        }

        return redirect()->route('orders.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order $order
     * @return \Illuminate\Http\Response
     */
    public function show(Order $order)
    {
        if ($order->salon_id != session('selectedSalon')) {
            abort(403);
        }

        $salonManagerRoleId = SalonRole::where('name', 'manager')->first()->id;
        $freeStaffs = DB::table('users')->join('salon_user', 'users.id', '=', 'salon_user.user_id')
            ->where('salon_user.salon_id', session('selectedSalon'))
            ->where('salon_user.salon_role_id', '<>', $salonManagerRoleId)
            ->where('salon_user.status', collect(config('app.user_free_status'))->search('True'))
            ->get();

        return Inertia::render(
            'orders/Show.jsx',
            [
                [
                    'order' => $this->detailOrderPage($order),
                    'freeStaffs' => $freeStaffs,
                ],
            ]
        );
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Order        $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Order $order)
    {
        $textStatus = $request->status;
        $request->status = collect(config('app.order_status'))->search($request->status);

        $cancelId = collect(config('app.order_status'))->search('Cancel');
        $doneId = collect(config('app.order_status'))->search('Done');

        try {
            DB::transaction(
                function () use ($request, $order, $cancelId, $doneId) {
                    $order->update(
                        [
                            'status' => $request->status,
                            'updated_at' => now(),
                        ]
                    );

                    DB::table('order_product')->where('order_id', $order->id)
                        ->where('status', '<>', $cancelId)
                        ->update(
                            [
                                'status' => $doneId,
                                'updated_at' => now(),
                            ]
                        );
                },
                config('database.connections.mysql.max_attempts')
            );
            $salonManagers = DB::table('salon_user')
                ->where('salon_id', session('selectedSalon'))
                ->where('salon_role_id', SalonRole::where('name', 'manager')->get()->first()->id)
                ->get();

            $changingPerson = auth()->user()->first_name." ".auth()->user()->last_name;

            $orderToday = DB::table('orders')
                ->selectRaw('COUNT(*) as serial')
                ->whereDate('created_at', now()->toDateString())
                ->where('id', '<=', $order->id)
                ->first();

            $title = __("Order-Status-Updated", ['Serial' => $orderToday->serial]);
            $message = __(
                'Change-Order-Status',
                [
                    'ChangingPerson' => $changingPerson,
                    'Serial' => $orderToday->serial,
                    'NewStatus' => $textStatus,
                ]
            );

            foreach ($salonManagers as $salonManager) {
                $salonManagerInstance = User::find($salonManager->user_id);
                $salonManagerInstance->notify(new OrderNotification($order, auth()->user(), $title, $message));
            }
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'update' => $e->getMessage(),
                ]
            );
        }

        return redirect()->route('orders.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order $order
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order $order)
    {
        DB::transaction(
            function () use ($order) {
                $order->products()->detach();
                $order->delete();
            },
            config('database.connections.mysql.max_attempts')
        );

        return redirect()->route('orders.index');
    }

    private function transformOrder()
    {
        $orders = Order::with(['customer', 'products', 'bill'])->where('salon_id', session('selectedSalon'))
            ->whereDate('created_at', now()->toDateString())
            ->get();

        foreach ($orders as $index => $order) {
            $order->serial = ++$index;
            $order->time_arrive = Carbon::create($order->created_at)->format('d/m/y H:i');
            $order->status = config('app.order_status')[$order->status];

            if (isset($order->bill)) {
                $order->pay_order = true;
            } else {
                $order->pay_order = false;
            }
        }

        return $orders;
    }

    private function detailOrderPage(Order $order)
    {
        $creation_time = Carbon::create($order->created_at);
        $serial = DB::table('orders')
            ->whereBetween('created_at', [$creation_time->format('Y-m-d 00:00:00'), $order->created_at])
            ->count();

        $order->load(['customer', 'products']);

        foreach ($order->products as $product) {
            $pivotId = $product->pivot->id;
            $product->order_product_id = $pivotId;
        }

        $order->time_order = $creation_time->format('d/m/y H:i');
        $order->status = config('app.order_status')[$order->status];
        $order->serial = $serial;

        foreach ($order->products as $product) {
            $product->quantity = $product->pivot->quantity;
            $product->status = config('app.order_status')[$product->pivot->status];
            $product->creation_time = Carbon::create($product->pivot->created_at)->format('d/m/y H:i');

            if (isset($product->pivot->staff_id)) {
                $staff = User::where('id', $product->pivot->staff_id)->get();
                $product->staff_name = $staff[0]->last_name . " " . $staff[0]->first_name;
                $product->staff_id = $product->pivot->staff_id;
            } else {
                $product->staff_name = "";
                $product->staff_id = null;
            }
        }

        return $order;
    }

    public function selectStaff(Request $request, $id)
    {
        $validated = $request->validate(
            [
                'staff' => 'numeric|required|exists:users,id',
                'prevStaff' => 'numeric|required',
            ]
        );
        try {
            DB::transaction(
                function () use ($validated, $id) {
                    DB::table('order_product')->where('id', $id)->update(
                        [
                            'staff_id' =>  $validated['staff'],
                        ]
                    );

                    DB::table('salon_user')->where('user_id', $validated['staff'])->update(
                        [
                        'status' => collect(config('app.user_free_status'))->search('False'),
                        ]
                    );

                    if ($validated['prevStaff'] > 0) {
                        DB::table('salon_user')->where('user_id', $validated['prevStaff'])->update(
                            [
                            'status' => collect(config('app.user_free_status'))->search('True'),
                            ]
                        );
                    }

                    $productId = DB::table('order_product')->find($id)->product_id;
                    $productName = Product::find($productId)->name;

                    $orderId = DB::table('order_product')->find($id)->order_id;

                    $title = __('Assigned-New-Order-Product');
                    $message = __(
                        'Order-Product-Assigned',
                        [
                            'ProductName' => $productName,
                            'OrderId' => $orderId,
                        ]
                    );

                    User::find($validated['staff'])->notify(new OrderProductNotification($title, $message));
                },
                config('database.connections.mysql.max_attempts')
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'selectStaff' => $e->getMessage(),
                ]
            );
        }

        return redirect()->back();
    }

    public function updateProduct(Request $request, $id)
    {
        $textStatus = $request->status;
        $request->status = collect(config('app.order_product_status'))->search($request->status);

        try {
            DB::transaction(
                function () use ($request, $id, $textStatus) {
                    DB::table('order_product')->where('id', $id)
                        ->update(['status' => $request->status]);

                    if ($textStatus === 'Cancel') {
                        $orderProduct = DB::table('order_product')->where('id', $id)->first();
                        $staffId = $orderProduct->staff_id;
                        $orderId = $orderProduct->order_id;
                        $productId = $orderProduct->product_id;
                        $productName = Product::find($productId)->name;

                        if ($staffId) {
                            DB::table('salon_user')->where('user_id', $staffId)->update(
                                [
                                    'status' => collect(config('app.user_free_status'))->search('True'),
                                ]
                            );
                            $title = __('Product-Canceled');
                            $message = __('Canceled-Product', ['ProductName' => $productName, 'OrderId' => $orderId]);

                            DB::table('order_product')->where('id', $id)->update(
                                [
                                    'staff_id' => null,
                                ]
                            );

                            User::find($staffId)->notify(new OrderProductNotification($title, $message));
                        }
                    }
                },
                config('database.connections.mysql.max_attempts')
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'update' => $e->getMessage(),
                ]
            );
        }

        return redirect()->back();
    }
}
