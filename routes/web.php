<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\Registration;
use Inertia\Inertia;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SalonController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\SelectWorkingSalonController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Models\Category;

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
    [DashboardController::class, 'index']
)->middleware(['auth', 'verified', 'salonManager'])->name('dashboard');

Route::middleware(['auth', 'verified', 'salonManager'])->group(function () {
    Route::resource('/products', ProductController::class);

    Route::put('/products/{product}/inactive', [ProductController::class, 'inactive'])->name('products.inactive');
});

Route::resource('salons', SalonController::class)->middleware('superAdmin');
Route::resource('staffs', StaffController::class)->middleware('auth', 'verified');
Route::resource('categories', CategoryController::class)->middleware('auth', 'verified');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('/orders', OrderController::class);
    Route::resource('/customers', CustomerController::class);
    Route::get('select-working-salon/{id}', [SelectWorkingSalonController::class, 'index'])->name('selectSalon.show');
    Route::post('select-working-salon', [SelectWorkingSalonController::class, 'select'])->name('selectSalon.select');
});

Route::put('staffs/{staff}/inactive', [StaffController::class, 'inActive'])
    ->middleware('auth', 'verified')->name('staffs.inActive');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile/{id}', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
