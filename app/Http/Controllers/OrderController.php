<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Salon;
use App\Models\User;
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
        return Inertia::render('orders/Index.jsx', [
            ['orders' => $this->transformOrder()],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show(Order $order)
    {
        return Inertia::render('orders/Show.jsx', [
            ['order' => $this->detailOrderPage($order)],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order $order)
    {
        //
    }

    private function transformOrder()
    {
        $orders = Order::with(['customer', 'products'])->whereDate('created_at', now()->toDateString())
            ->orderByDesc('created_at')->get();
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
