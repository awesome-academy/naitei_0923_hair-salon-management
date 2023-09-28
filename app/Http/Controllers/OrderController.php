<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Salon;
use App\Models\User;
use App\Models\Customer;
use App\Models\SalonRole;
use App\Notifications\OrderNotification;
use App\Http\Requests\StoreOrderRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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

        $order_status = collect(config('app.order_status'));
        $prepare_id = $order_status->search('Prepare');

        $products = $request->input('products');

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

        return Inertia::render(
            'orders/Show.jsx',
            [
                ['order' => $this->detailOrderPage($order)],
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
                        ]
                    );

                    DB::table('order_product')->where('order_id', $order->id)
                        ->where('status', '<>', $cancelId)
                        ->update(['status' => $doneId]);
                },
                config('database.connections.mysql.max_attempts')
            );
            $salonManagers = DB::table('salon_user')
                ->where('salon_id', session('selectedSalon'))
                ->where('salon_role_id', SalonRole::where('name', 'manager')->get()->first()->id)
                ->get();

            $changingPerson = auth()->user()->first_name." ".auth()->user()->last_name;

            $title = __("Order-Status-Updated", ['Id' => $order->id]);
            $message = __(
                'Change-Order-Status',
                [
                    'ChangingPerson' => $changingPerson,
                    'Id' => $order->id,
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
        $orders = Order::with(['customer', 'products'])->where('salon_id', session('selectedSalon'))
            ->whereDate('created_at', now()->toDateString())
            ->orderByDesc('created_at')
            ->get();
        $count = count($orders);

        foreach ($orders as $order) {
            $order->serial = $count--;
            $order->time_arrive = Carbon::create($order->created_at)->format('d/m/y H:i');
            $order->status = config('app.order_status')[$order->status];
        }

        return $orders;
    }

    public function detailOrderPage(Order $order)
    {
        $creation_time = Carbon::create($order->created_at);
        $serial = DB::table('orders')
            ->whereBetween('created_at', [$creation_time->format('Y-m-d 00:00:00'), $order->created_at])
            ->count();

        $order->load(['customer', 'products']);
        $order->time_order = $creation_time->format('d/m/y H:i');
        $order->status = config('app.order_status')[$order->status];
        $order->serial = $serial;

        foreach ($order->products as $product) {
            $product->quantity = $product->pivot->quantity;
            $product->status = config('app.order_status')[$product->pivot->status];
            $product->creation_time = Carbon::create($product->pivot->created_at)->format('d/m/y H:i');

            if (isset($product->pivot->staff_id)) {
                $staff = User::where('id', '=', $product->pivot->staff_id)->get('last_name');
                $product->staff_name = $staff[0]->last_name;
            } else {
                $product->staff_name = "";
            }
        }

        return $order;
    }
}
