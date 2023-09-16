<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Package;
use App\Models\Registration;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render(
            'Auth/Register',
            [
                'packages' => Package::select('id', 'name')->get(),
            ]
        );
    }

    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $registration_status = collect(config('app.registration_status'));
        $rejected_id = $registration_status->search('Waiting');
        try {
            $request->validate(
                [
                    'firstName' => 'required|string|max:255',
                    'lastName' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:registrations',
                    'phoneNumber' => 'required|numeric|min:30',
                    'password' => ['required', 'confirmed', Rules\Password::defaults()],
                    'salonName' => 'required|string|max:255',
                    'address' => 'required|string|max:255',
                    'staffNumber' => 'required|numeric|min:1',
                    'seatNumber' => 'required|numeric|min:1',
                    'registrationPackage' => 'required|numeric|exists:packages,id',
                ]
            );

            $user = Registration::create(
                [
                    'first_name' => $request->firstName,
                    'last_name' => $request->lastName,
                    'email' => $request->email,
                    'phone' => $request->phoneNumber,
                    'password' => Hash::make($request->password),
                    'salon_name' => $request->salonName,
                    'address' => $request->address,
                    'staffs_number' => $request->staffNumber,
                    'seats_number' => $request->seatNumber,
                    'package_id' => $request->registrationPackage,
                    'status' => $rejected_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'register' => $e.getMessage(),
                ]
            );
        }

        return redirect()->back();
    }
}
