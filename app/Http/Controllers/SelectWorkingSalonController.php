<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
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

        return redirect()->route('dashboard');
    }
}
