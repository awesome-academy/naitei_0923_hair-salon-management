<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Inertia\Inertia;
use Redirect;
use Exception;
use DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $users = User::with('salons')->get();

        foreach ($users as $user) {
            $user->salon_names = $user->salons->pluck('name');
            $user->is_active = config('app.user_active')[$user->is_active];
        }

        $sortedUsers = $users->sortBy(
            [
                ['is_active', 'desc'],
            ]
        );

        return Inertia::render(
            'users/Index.jsx',
            [
                'users' => $sortedUsers,
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $is_active = config('app.user_active')[$user->is_active];
        $user->is_active = $is_active;

        $userSalonsInfo = DB::table('salon_user')
            ->join('salons', 'salon_user.salon_id', '=', 'salons.id')
            ->join('salon_roles', 'salon_user.salon_role_id', '=', 'salon_roles.id')
            ->where('salon_user.user_id', '=', $user->id)
            ->select('salons.name as salon_name', 'salon_roles.name as role_name')
            ->distinct()
            ->get();

        $userSalonsInfo = $userSalonsInfo->toArray();

        return Inertia::render(
            'users/Show.jsx',
            [
                [
                    'user' => $user,
                    'userSalons' => $userSalonsInfo,
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
        $user = User::find($id);

        $salonRoles = DB::table('salon_roles')->select('id', 'name')->get()->toArray();

        return Inertia::render(
            'users/Edit.jsx',
            [
                [
                    'user' => $user,
                    'salonRoles' => $salonRoles,
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
    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $validated = $request->validated();

            DB::table('users')->where('id', intval($id))
                ->update(
                    [
                        'email' => $validated['email'],
                        'first_name' => $validated['first_name'],
                        'last_name' => $validated['last_name'],
                        'phone' => $validated['phone'],
                        'is_active' => $validated['is_active'],
                    ]
                );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'update' => $e->getMessage(),
                ]
            );
        }

        return redirect()->route('users.index');
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
        return redirect()->route('users.index');
    }
}
