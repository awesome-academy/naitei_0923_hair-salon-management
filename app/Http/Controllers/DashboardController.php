<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use Inertia\Inertia;
use DB;

class DashboardController extends Controller
{
    
    public function index()
    {
        $latestSerial = Order::whereDate('created_at', today())->latest()->first();
        $nextSerial = $latestSerial ? $latestSerial->id + 1 : 1;

        $lastOrderId = DB::table('orders')->max('id');
        $lastCustomerId = DB::table('customers')->max('id');

        $products = Product::all()->map(
            function ($item, $key) {
                return $item->only(['id', 'name']);
            }
        );

        $nextOrder = [
            'next_serial' => $nextSerial,
            'order_id' => $lastOrderId ? $lastOrderId + 1 : 1,
            'customer_id' => $lastCustomerId ? $lastCustomerId + 1 : 1,
            'products' => $products,
        ];

        return Inertia::render(
            'Dashboard',
            [
                [
                    'nextOrder' => $nextOrder,
                    'selectedSalon' => session('selectedSalon'),
                ],
            ]
        );
    }
}
