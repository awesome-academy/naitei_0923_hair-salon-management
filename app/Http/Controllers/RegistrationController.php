<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Registration;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function index()
    {
        $registrations = Registration::all();

        foreach ($registrations as $registration) {
            $registration->status = config('app.registration_status')[$registration->status];
        }

        $sortedRegistrations = $registrations->sortBy(
            [
                ['status', 'desc'],
                ['created_at', 'desc'],
            ]
        );

        return Inertia::render(
            'Registrations',
            [
                'registrations' => $sortedRegistrations,
            ]
        );
    }

    public function reject(Request $request, Registration $registration)
    {
        $registration_status = collect(config('app.registration_status'));
        $rejected_id = $registration_status->search('Rejected');

        try {
            $registration->update(['status'=> $rejected_id]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'reject' => $e->getMessage(),
                ]
            );
        }
        
        return redirect()->route('registrations.index');
    }
}
