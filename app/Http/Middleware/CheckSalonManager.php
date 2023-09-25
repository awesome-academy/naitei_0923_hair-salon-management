<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\SystemRole;
use App\Models\SalonRole;
use DB;

class CheckSalonManager
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse) $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if ($user->system_role === 'super admin') {
            abort(401);
        }

        $selectedSalonId = $request->session()->get('selectedSalon');
        $salonRoleId =  DB::table('salon_user')->where('user_id', $user->id)->where('salon_id', $selectedSalonId)
            ->get()->first()->salon_role_id;

        if ($user && $user->systemRole == 'user'
            && SalonRole::find($salonRoleId)->name == 'manager'
        ) {
            return $next($request);
        }

        abort(401);
    }
}
