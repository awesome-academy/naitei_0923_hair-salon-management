<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use App\Models\SystemRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use DB;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $userId = User::where('email', $request->email)->get()->first()->id;

        $request->session()->regenerate();

        $systemRoleId = User::find($userId)->system_role_id;

        if (SystemRole::find($systemRoleId)->name == 'super admin') {
            return redirect()->route('registrations.index');
        }

        $salonNumber = DB::table('salon_user')->where('user_id', $userId)->count();
        
        if ($salonNumber == 1) {
            $salonId = DB::table('salon_user')->where('user_id', $userId)->first()->salon_id;
            $request->session()->put('selectedSalon', $salonId);
            return redirect()->route('orders.index');
        }

        return redirect()->route('selectSalon.show', ["id" => $userId]);
    }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->forget('selectedSalon');

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
