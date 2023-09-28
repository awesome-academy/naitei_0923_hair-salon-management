<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use DB;

class NotificationController extends Controller
{
    public function index()
    {
        auth()->user()->unreadNotifications->markAsRead();

        return Inertia::render('notifications/Index.jsx', [
            'notifications' => auth()->user()->notifications,
        ]);
    }

    public function destroy($id)
    {
        DB::table('notifications')->delete($id);

        return redirect()->route('notifications.index');
    }
}
