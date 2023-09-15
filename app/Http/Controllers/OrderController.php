<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Salon;
use Carbon\Carbon;
use Illuminate\Http\Request;
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
            'order' => $order->load(['customer', 'products']),
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
}
