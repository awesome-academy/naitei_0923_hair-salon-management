<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBillRequest;
use App\Models\Bill;
use App\Models\Order;
use App\Models\User;
use App\Notifications\QuantityProductNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Exception;

class BillController extends Controller
{
    public function store(StoreBillRequest $request, Order $order)
    {
        $request->validated();

        foreach ($order->products as $product) {
            $quantityOrderProduct = $product->pivot->quantity;
            $quantityProduct = $product->quantity;

            if ($quantityProduct < $quantityOrderProduct) {
                return redirect()->back()->withErrors(
                    [
                        'store' => __('Warning-Product-Quantity-Run-Out-Description', [
                            'ProductName' => $product->name,
                            'QuantityProduct' => $quantityProduct,
                        ]),
                    ]
                );
            }
        }

        try {
            DB::transaction(
                function () use ($order, $request) {
                    foreach ($order->products as $product) {
                        $quantityOrderProduct = $product->pivot->quantity;
                        $quantityProduct = $product->quantity;

                        $updateQuantityProduct = $quantityProduct - $quantityOrderProduct;
                        DB::table('products')
                            ->where('id', '=', $product->id)
                            ->update([ 'quantity' => $updateQuantityProduct ]);

                        if ($quantityProduct == $quantityOrderProduct) {
                            $title = __('Product-Out-Of-Stock');
                            $message = __('Warning-Product-Quantity-Run-Out-Description', [
                                'ProductName' => $product->name,
                                'QuantityProduct' => $updateQuantityProduct,
                            ]);

                            User::find(Auth::id())->notify(new QuantityProductNotification($title, $message));
                        } else {
                            if ($updateQuantityProduct < config('app.warning_product_run_out')) {
                                $title = __('Warning-Product-Quantity-Run-Out');
                                $message = __('Warning-Product-Quantity-Run-Out-Description', [
                                    'ProductName' => $product->name,
                                    'QuantityProduct' => $updateQuantityProduct,
                                ]);

                                User::find(Auth::id())->notify(new QuantityProductNotification($title, $message));
                            }
                        }
                    }

                    DB::table('bills')->insert([
                        'order_id' => $order->id,
                        'payment_method' => $request->payment_method,
                        'total' => $request->total,
                        'cash' => $request->cash_money,
                        'change' => $request->change_money,
                        'status' => array_search("Paid", config('app.bill_status')),
                        'created_at' => now(),
                    ]);
                },
                config('database.connections.mysql.max_attempts')
            );

            return redirect()->route('bills.show', [$order->id]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'store' => $e->getMessage(),
                ]
            );
        }
    }

    public function show(Order $order)
    {
        return Inertia::render('bills/Show.jsx', [
            ['order' => $this->calculateBill($order)],
        ]);
    }

    private function calculateBill(Order $order)
    {
        $order->load(['customer', 'products', 'bill']);
        $order->created_time_order = Carbon::create($order->created_at)->format('d/m/y H:i');
        $order->status = config('app.order_status')[$order->status];

        $bill_total = 0;
        if (isset($order->bill)) {
            $order->bill->status = config('app.bill_status')[$order->bill->status];
            $bill_total = $order->bill->total;
        }

        $total_payable = 0;
        foreach ($order->products as $product) {
            $product->creation_time = Carbon::create($product->created_at)->format('d/m/y H:i');
            $product->status = config('app.order_status')[$product->pivot->status];
            $product->quantity = $product->pivot->quantity;

            if ($product->status == config('app.order_status')[2]) {
                $product->total = $product->pivot->quantity * $product->cost;
                $total_payable += $product->total;
            }
        }
        $order->total_payable = $total_payable - $bill_total;

        return $order;
    }
}
