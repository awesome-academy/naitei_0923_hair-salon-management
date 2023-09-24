<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UpdateStaffRequest;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\SystemRole;
use App\Models\SalonRole;
use Inertia\Inertia;
use Redirect;
use Exception;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $staffs = DB::table('users')
            ->join('salon_user', 'users.id', '=', 'salon_user.user_id')
            ->where('salon_user.salon_id', session('selectedSalon'))
            ->select(['users.*', 'salon_user.salon_role_id'])
            ->distinct()
            ->get();

        foreach ($staffs as $staff) {
            $role = DB::table('salon_roles')->where('id', $staff->salon_role_id)->value('name');
            $is_active = config('app.user_active')[$staff->is_active];

            if ($role) {
                $staff->role = $role;
                $staff->is_active = $is_active;
            }
        }

        $sortedStaffs = $staffs->sortBy(
            [
                ['is_active', 'desc'],
                ['created_at', 'desc'],
            ]
        );

        return Inertia::render(
            'staffs/Index.jsx',
            [
                [
                    'staffs' => $sortedStaffs,
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
        $salonRoles = DB::table('salon_roles')->select('id', 'name')->get()->toArray();
        return Inertia::render(
            'staffs/Create.jsx',
            [
                'salonRoles' => $salonRoles,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        try {
            $user_active = collect(config('app.user_active'));
            $active_id = $user_active->search('True');

            DB::transaction(
                function () use ($validated, $active_id) {
                    $userID = DB::table('users')->insertGetId(
                        [
                            'email' => $validated['email'],
                            'email_verified_at' => now(),
                            'password' => Hash::make($validated['password']),
                            'system_role_id' => SystemRole::where('name', 'user')->get()->first()->id,
                            'first_name' => $validated['first_name'],
                            'last_name' => $validated['last_name'],
                            'phone' => $validated['phone'],
                            'is_active' => $validated['is_active'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );

                    DB::table('salon_user')->insert(
                        [
                            'user_id' => $userID,
                            'salon_id' => session('selectedSalon'),
                            'salon_role_id' => $validated['salon_role'],
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

        return redirect()->route('staffs.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show(User $staff)
    {
        $is_active = config('app.user_active')[$staff->is_active];
        $staff->is_active = $is_active;

        $salonRoleId = DB::table('salon_user')->where('user_id', $staff->id)
            ->where('salon_id', session('selectedSalon'))
            ->get()->first()->salon_role_id;

        $salonRole = SalonRole::find($salonRoleId)->name;

        $staff->salon_role = $salonRole;

        return Inertia::render(
            'staffs/Show.jsx',
            [
                [
                    'staff' => $staff,
                ],
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $staff = User::find($id);

        $salonRoles = DB::table('salon_roles')->select('id', 'name')->get()->toArray();

        $salonRoleId = DB::table('salon_user')->where('user_id', $id)->where('salon_id', session('selectedSalon'))
            ->get()->first()->salon_role_id;

        $salonRole = SalonRole::find($salonRoleId)->name;

        return Inertia::render(
            'staffs/Edit.jsx',
            [
                [
                    'staff' => $staff,
                    'salonRoles' => $salonRoles,
                    'salonRole' => $salonRole,
                    'salonRoleId' => $salonRoleId,
                ],
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int                      $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateStaffRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            DB::transaction(
                function () use ($validated, $id) {
                    DB::table('users')->where('id', intval($id))
                        ->update(
                            [
                                'email' => $validated['email'],
                                'first_name' => $validated['first_name'],
                                'last_name' => $validated['last_name'],
                                'phone' => $validated['phone'],
                                'is_active' => $validated['is_active']
                            ]
                        );

                    DB::table('salon_user')->where('user_id', intval($id))
                        ->update(['salon_role_id' => $validated['salon_role']]);
                },
                config('database.connections.mysql.max_attempts')
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'update' => $e->getMessage(),
                ]
            );
        }

        return redirect()->route('staffs.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);

        try {
            DB::transaction(function () use ($user) {
                $user->salons()->detach();

                DB::table('order_product')
                    ->where('staff_id', $user->id)
                    ->update(['staff_id' => null]);

                $user->delete();
            }, config('database.connections.mysql.max_attempts'));
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'delete' => $e->getMessage(),
                ]
            );
        }
        return redirect()->route('staffs.index');
    }
}
