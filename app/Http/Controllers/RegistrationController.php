<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Registration;
use Inertia\Inertia;

class RegistrationController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Registrations', [
            'registrations' => Registration::all(),
        ]);
    }
}
