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
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\TwilioSMSController;
use App\Http\Controllers\LanguageController;
use App\Models\Category;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

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

        Route::resource('salons', SalonController::class);
        Route::resource('users', UserController::class);
    }
);


Route::middleware(['auth', 'verified', 'salonManager'])->group(function () {
    Route::post('/customers/sendOTP', [CustomerController::class, 'sendOTP'])->name('customers.sendOTP');
    Route::post('/customers/checkOTP', [CustomerController::class, 'checkOTP'])->name('customers.checkOTP');
    Route::resource('/customers', CustomerController::class);
    Route::resource('/products', ProductController::class);
    Route::resource('/categories', CategoryController::class);
    Route::resource('staffs', StaffController::class);
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/{startDate}/{endDate}', [DashboardController::class, 'getDataWithDates'])
        ->name('dashboard.getData');

    Route::put('/products/{product}/inactive', [ProductController::class, 'inactive'])->name('products.inactive');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('/orders', OrderController::class);
    Route::put('/order-products-select-staff/{id}', [OrderController::class, 'selectStaff'])
        ->name('orders.selectStaff');
    Route::put('/order-products-change-status/{id}', [OrderController::class, 'updateProduct'])
        ->name('orders.updateProduct');
    Route::resource('/customers', CustomerController::class);
    Route::get('select-working-salon/{id}', [SelectWorkingSalonController::class, 'index'])->name('selectSalon.show');
    Route::post('select-working-salon', [SelectWorkingSalonController::class, 'select'])->name('selectSalon.select');
    Route::get('/bills/order/{order}', [BillController::class, 'show'])->name('bills.show');
    Route::post('/bills/order/{order}', [BillController::class, 'store'])->name('bills.store');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile/{id}', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('language/{lang}', [LanguageController::class, 'changeLanguage'])->name('locale');

Route::get('sendSMS', [TwilioSMSController::class, 'index']);

require __DIR__.'/auth.php';
