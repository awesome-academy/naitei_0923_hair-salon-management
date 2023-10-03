<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Twilio\Rest\Client;

class CustomerController extends Controller
{
    public function sendOTP(Request $request)
    {
        $validated = $request->validate(
            [
                'phoneNumber' => 'required|string|max:30',
            ]
        );
        $validated['phoneNumber'] =  "+1" . ltrim($validated['phoneNumber'], '0');
        $sid = getenv("TWILIO_SID");
        $token = getenv("TWILIO_TOKEN");
        $twilio = new Client($sid, $token);

        $verification = $twilio->verify->v2->services("VA1b205eb22b870ef00da6060e37e3f686")
            ->verifications
            ->create($validated['phoneNumber'], "sms");

        return redirect()->route('customers.index');
    }

    public function checkOTP(StoreCustomerRequest $request)
    {
        $validated = $request->validated();

        $sid = getenv("TWILIO_SID");
        $token = getenv("TWILIO_TOKEN");
        $twilio = new Client($sid, $token);

        $validated['phoneNumber'] =  "+1" . ltrim($validated['phoneNumber'], '0');

        $verification_check = $twilio->verify->v2->services("VA1b205eb22b870ef00da6060e37e3f686")
            ->verificationChecks
            ->create(
                [
                    "to" => $validated['phoneNumber'],
                    "code" => $validated['OTP'],
                ]
            );
        if ($verification_check->status == 'approved') {
            $this->store($request);
        }

        return redirect()->route('customers.index');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render(
            'customers/Index.jsx',
            [
                ['customers' => Customer::where('salon_id', session('selectedSalon'))->get()],
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
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store($request)
    {
        if (!isset($request->isActive)) {
            $request->isActive = false;
        }

        $customer = new Customer();

        $customer->name = $request->name;
        $customer->phone = $request->phoneNumber;
        $customer->is_active = $request->isActive;
        $customer->salon_id = session('selectedSalon');

        $customer->save();
        return redirect()->route('customers.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Customer $customer
     * @return \Illuminate\Http\Response
     */
    public function show(Customer $customer)
    {
        if ($customer->salon_id != session('selectedSalon')) {
            abort(403);
        }

        return Inertia::render(
            'customers/Show.jsx',
            [
                ['customer' => $this->detailCustomerPage($customer)],
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Customer $customer
     * @return \Illuminate\Http\Response
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Customer     $customer
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $request->validated();

        $customer->update(
            [
                'name' => $request->name,
                'phone' => $request->phone,
                'is_active' => $request->is_active,
            ]
        );

        return redirect()->route('customers.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Customer $customer
     * @return \Illuminate\Http\Response
     */
    public function destroy(Customer $customer)
    {
        DB::transaction(
            function () use ($customer) {
                foreach ($customer->orders as $order) {
                    $order->products()->detach();
                }
                $customer->orders()->delete();
                $customer->delete();
            },
            config('database.connections.mysql.max_attempts')
        );

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
