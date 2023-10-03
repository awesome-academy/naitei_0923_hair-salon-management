<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SystemRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Laravel\Socialite\Facades\Socialite;

class OAuthLoginController extends Controller
{
    public function redirectLoginPage($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function handleCallback($provider)
    {
        try {
            $userSocialite = Socialite::driver($provider)->user();
            $user = User::where('email', $userSocialite->getEmail())->first();

            if (isset($user)) {
                Auth::login($user);

                if (SystemRole::find($user->system_role_id)->name == 'super admin') {
                    return redirect()->route('registrations.index');
                }

                $salonNumber = DB::table('salon_user')->where('user_id', $user->id)->count();

                if ($salonNumber == 1) {
                    $salonId = DB::table('salon_user')->where('user_id', $user->id)->first()->salon_id;
                    Session::put('selectedSalon', $salonId);

                    return redirect()->route('orders.index');
                }

                return redirect()->route('selectSalon.show', ["id" => $user->id]);
            } else {
                return redirect()->route('login');
            }
        } catch (Exception $e) {
            return redirect()->route('login')->withErrors(
                [
                    'login' => $e->getMessage(),
                ]
            );
        }
    }
}
