<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\Registration;
use Inertia\Inertia;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SalonController;
use App\Http\Controllers\RegistrationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get(
    '/',
    function () {
        return Inertia::render(
            'Welcome',
            [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'laravelVersion' => Application::VERSION,
                'phpVersion' => PHP_VERSION,
            ]
        );
    }
);

Route::middleware(['superAdmin'])->group(
    function () {

        Route::get(
            '/registrations',
            [
                RegistrationController::class,
                'index',
            ]
        )->name('registrations.index');

        Route::put(
            '/registrations/{registration}',
            [
                RegistrationController::class,
                'reject',
            ]
        )->name('registrations.reject');
    }
);

Route::get(
    '/dashboard',
    function () {
        return Inertia::render('Dashboard');
    }
)->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::resource('/orders', OrderController::class);
    Route::resource('/customers', CustomerController::class);
});
Route::resource('salons', SalonController::class)->middleware('superAdmin');

require __DIR__.'/auth.php';
