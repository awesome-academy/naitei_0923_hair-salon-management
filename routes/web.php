<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\Registration;
use Inertia\Inertia;
use App\Http\Controllers\OrderController;
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

Route::get(
    '/registrations',
    [
    RegistrationController::class,
    'index'
    ]
)->middleware(['auth', 'verified'])->name('registrations.index');

Route::get(
    '/dashboard',
    function () {
        return Inertia::render('Dashboard');
    }
)->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('/orders', OrderController::class)->middleware('auth');

require __DIR__.'/auth.php';
