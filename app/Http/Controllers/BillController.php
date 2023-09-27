<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBillRequest;
use App\Models\Bill;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillController extends Controller
{
    public function store(StoreBillRequest $request, Order $order)
    {
        $request->validated();

        $bill = new Bill();
        $bill->order_id = $order->id;
        $bill->payment_method = $request->payment_method;
        $bill->total = $request->total;
        $bill->cash = $request->cash_money;
        $bill->change = $request->change_money;
        $bill->status = array_search("Paid", config('app.bill_status'));
        $bill->save();

        return redirect()->route('bills.show', [$order->id]);
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
