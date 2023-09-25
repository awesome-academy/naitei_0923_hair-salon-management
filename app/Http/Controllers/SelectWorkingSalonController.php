<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SalonRole;
use Illuminate\Support\Facades\Auth;
use DB;

class SelectWorkingSalonController extends Controller
{
    public function index($id)
    {
        $mySalons =  DB::table('salons')
            ->join('salon_user', 'salons.id', '=', 'salon_user.salon_id')
            ->where('salon_user.user_id', $id)
            ->select('salons.*')
            ->distinct()
            ->get();

        return Inertia::render('SelectWorkingSalon', ['mySalons' => $mySalons]);
    }

    public function select(Request $request)
    {
        $request->session()->put('selectedSalon', $request->id);

        $salon_role_id = DB::table('salon_user')->where('user_id', Auth::user()->id)->where('salon_id', $request->id)
            ->get()->first()->salon_role_id;

        $salon_role = SalonRole::find($salon_role_id)->name;

        if ($salon_role == 'manager') {
            return redirect()->route('dashboard');
        }

        return redirect()->route('orders.index');
    }
}
