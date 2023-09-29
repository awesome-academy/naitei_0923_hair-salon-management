<?php

namespace App\Http\Controllers;

use App\Models\Salon;
use App\Models\Package;
use Illuminate\Http\Request;
use App\Http\Requests\StoreSalonRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Exception;
use Carbon\Carbon;
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
                    'salons' => $this->getAllSalon(),
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

        $user_active = collect(config('app.user_active'));
        $active_id = $user_active->search('True');

        $salon_active = collect(config('app.salon_active'));
        $salon_active_id = $salon_active->search('True');

        $systemRoleId = DB::table('system_roles')
            ->where('name', 'user')
            ->value('id');

        try {
            DB::transaction(
                function () use ($validated, $accepted_id, $active_id, $salon_active_id, $systemRoleId) {
                    DB::table('salons')->insert(
                        [
                            'owner_email' => $validated['email'],
                            'name' => $validated['salon_name'],
                            'address' => $validated['address'],
                            'package_id' => $validated['package_id'],
                            'is_active' => $salon_active_id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );

                    DB::table('registrations')->where('email', $validated['email'])
                        ->update([ 'status' => $accepted_id]);

                    DB::table('users')->insert(
                        [
                            'email' => $validated['email'],
                            'phone' => $validated['phone'],
                            'email_verified_at' => now(),
                            'first_name' => $validated['first_name'],
                            'last_name' => $validated['last_name'],
                            'password' => $validated['password'],
                            'is_active' => $active_id,
                            'created_at' => now(),
                            'updated_at' => now(),
                            'system_role_id' => $systemRoleId,
                        ]
                    );
                },
                config('database.connections.mysql.max_attempts')
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'store' => $e->getMessage(),
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
        $salon = Salon::with(['users','customers','package'])->find($salon->id);
        if ($salon) {
            return Inertia::render('salons/Show', [
                [
                    'salon' => $this->aggregateSalonInformation($salon),
                ],
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Salon $salon
     * @return \Illuminate\Http\Response
     */
    public function edit(Salon $salon)
    {
        return Inertia::render(
            'salons/Edit',
            [
                [
                    'salon' => $salon,
                    'packages' => DB::table('packages')->select('id', 'name')->orderBy('id')->get(),
                    'salon_active' => config('app.salon_active'),
                    'updated_at' => now(),
                ],
            ]
        );
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
        $validated = $request->validate([
            'active' => 'boolean|required',
            'address' => 'string|required|max:255',
            'id' => 'numeric|required|exists:salons,id',
            'name' => 'string|required|max:255',
            'owner_email' => 'email|required|max:255',
            'package_id' => 'numeric|required|exists:packages,id',
        ]);

        try {
            $salon->update(
                [
                    'name' => $validated['name'],
                    "owner_email" => $validated['owner_email'],
                    "address" => $validated['address'],
                    "package_id" => $validated['package_id'],
                    "is_active" => $validated['active'],
                ]
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'update' => __('There was an error'),
                ]
            );
        }

        return redirect()->route('salons.show', ['salon' => $salon->id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Salon $salon
     * @return \Illuminate\Http\Response
     */
    public function destroy(Salon $salon)
    {
        try {
            DB::transaction(
                function () use ($salon) {
                    $salon = Salon::with(['categories','customers'])->find($salon->id);
                    if ($salon) {
                        $customers = $salon->customers;
                        if ($customers) {
                            DB::table('customers')->where('salon_id', $salon->id)
                                ->whereIn('id', $customers->pluck('id'))->delete();
                        }
                        $categories = $salon->categories;
                        if ($categories) {
                            DB::table('categories')->where('salon_id', $salon->id)
                                ->whereIn('id', $categories->pluck('id'))->delete();
                        }
                        $salon->delete();
                    }
                },
                config('database.connections.mysql.max_attempts')
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'delete' => __('There was an error'),
                ]
            );
        }
        
        return redirect()->route('salons.index');
    }

    private function getAllSalon()
    {
        $allSalons = Salon::with(['users','customers','package'])->get();
        foreach ($allSalons as $salon) {
            $salon = clone $this->aggregateSalonInformation($salon);
        }

        return $allSalons;
    }

    private function aggregateSalonInformation(Salon $salon)
    {
        $numStaffs = count($salon->users);
        $numCustomers = count($salon->customers);
        $salon->num_staffs = $numStaffs;
        $salon->num_customers = $numCustomers;
        $salon->is_active = config('app.salon_active')[$salon->is_active];
        $salon->created_time = Carbon::create($salon->created_at)->format('d/m/y H:i');
        return $salon;
    }
}
