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
        $latestSerial = Order::where('salon_id', session('selectedSalon'))->whereDate('created_at', today())->count();
        $nextSerial = $latestSerial ? $latestSerial + 1 : 1;

        $products = Product::all()->map(
            function ($item, $key) {
                return $item->only(['id', 'name']);
            }
        );

        $customers = Customer::where('salon_id', session('selectedSalon'))->get()->map(
            function ($item, $key) {
                return $item->only(['id', 'phone']);
            }
        );

        $nextOrder = [
            'next_serial' => $nextSerial,
            'products' => $products,
        ];

        return Inertia::render(
            'Dashboard',
            [
                [
                    'nextOrder' => $nextOrder,
                    'salon' => session('selectedSalon'),
                    'customers' => $customers,
                ],
            ]
        );
    }
}
