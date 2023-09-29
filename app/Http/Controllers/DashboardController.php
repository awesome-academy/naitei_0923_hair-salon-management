<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Bill;
use App\Models\Customer;
use App\Models\Product;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redirect;
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
                    'today' => now()->format('Y-m-d'),
                    'firstDayInMonth' => now()->format('Y-m-01'),
                ],
            ]
        );
    }

    public function getDataWithDates(Request $request)
    {
        $salonId = session('selectedSalon');
        $date = [
            'start' => Carbon::createFromFormat('d-m-Y', $request->startDate)->format('Y-m-d 00:00:00'),
            'end' => Carbon::createFromFormat('d-m-Y', $request->endDate)->format('Y-m-d 23:59:59'),
        ];
        $bills = Bill::whereHas(
            'order',
            function ($query) use ($salonId) {
                $query->where('salon_id', $salonId);
            }
        )->where([
            ['status', '=', 1],
            ['created_at', '>' , $date['start'] ],
            ['created_at', '<' , $date['end'] ],
        ])->with('order.products')->orderBy('created_at')->get();

        foreach ($bills as $bill) {
            $bill->date = Carbon::createFromFormat('Y-m-d H:i:s', $bill->created_at)->format('d-m-Y');
            $bill->customer_id = $bill->order->customer_id;
        }

        return response()->json($bills);
    }
}
