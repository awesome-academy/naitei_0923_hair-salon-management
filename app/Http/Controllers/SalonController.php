<?php

namespace App\Http\Controllers;

use App\Models\Salon;
use Illuminate\Http\Request;
use App\Http\Requests\StoreSalonRequest;
use Inertia\Inertia;
use Redirect;
use Illuminate\Support\Facades\DB;

class SalonController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render(
            'salons/Salons',
            [
            [
                'salons' => $this->calculateSalon(),
            ],
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
    public function store(StoreSalonRequest $request)
    {
        $validated = $request->validated();

        $registration_status = collect(config('app.registration_status'));
        $accepted_id = $registration_status->search('Accepted');

        try {
            DB::transaction(
                function () use ($validated, $accepted_id) {
                    DB::table('salons')->insert(
                        [
                            'owner_email' => $validated['email'],
                            'name' => $validated['salon_name'],
                            'address' => $validated['address'],
                            'package_id' => $validated['package_id'],
                            'is_active' => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );

                    DB::table('registrations')->where('email', $validated['email'])
                        ->update([ 'status' => $accepted_id]);
                },
                config('database.connections.mysql.max_attempts')
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'store' => __('there was an error')
                ]
            );
        }

        return redirect()->route('salons.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Salon $salon
     * @return \Illuminate\Http\Response
     */
    public function show(Salon $salon)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Salon $salon
     * @return \Illuminate\Http\Response
     */
    public function edit(Salon $salon)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Salon        $salon
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Salon $salon)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Salon $salon
     * @return \Illuminate\Http\Response
     */
    public function destroy(Salon $salon)
    {
        //
    }

    private function calculateSalon()
    {
        $allSalons = Salon::with(['users','customers','package'])->get();
        foreach ($allSalons as $salon) {
            $numStaffs = count($salon->users);

            $numCustomers = count($salon->customers);

            $salon->num_staffs = $numStaffs;

            $salon->num_customers = $numCustomers;
        }

        return $allSalons;
    }
}
