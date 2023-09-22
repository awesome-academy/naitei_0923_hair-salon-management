<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('customers/Index.jsx', [
            ['customers' => Customer::all()],
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
    public function store(StoreCustomerRequest $request)
    {
        $request->validated();

        if (!isset($request->is_active)) {
            $request->is_active = false;
        }

        $customer = new Customer();

        $customer->name = $request->name;
        $customer->phone = $request->phone;
        $customer->is_active = $request->is_active;
        $customer->salon_id = session('selectedSalon');

        $customer->save();

        return redirect()->route('customers.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function show(Customer $customer)
    {
        return Inertia::render('customers/Show.jsx', [
            ['customer' => $this->detailCustomerPage($customer)],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Customer $customer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function destroy(Customer $customer)
    {
        DB::transaction(function () use ($customer) {
            foreach ($customer->orders as $order) {
                $order->products()->detach();
            }
            $customer->orders()->delete();
            $customer->delete();
        }, config('database.connections.mysql.max_attempts'));

        return redirect()->route('customers.index');
    }

    private function detailCustomerPage(Customer $customer)
    {
        $customer->load('orders');
        if ($customer->is_active) {
            $customer->active = 'Yes';
        } else {
            $customer->active = 'No';
        }

        foreach ($customer->orders as $order) {
            $order->creation_time = Carbon::create($order->created_at)->format('d/m/y H:i');
            $order->status = config('app.order_status')[$order->status];
        }

        return $customer;
    }
}
