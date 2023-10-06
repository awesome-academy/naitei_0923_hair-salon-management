<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use DB;

class NotificationController extends Controller
{
    public function index()
    {
        auth()->user()->unreadNotifications->markAsRead();

        $notifications = auth()->user()->notifications;
        foreach ($notifications as $notification) {
            $notification->creation_time = Carbon::create($notification->created_at)->format('H:i:s d/m/Y');
        }

        return Inertia::render('notifications/Index.jsx', [
            'notifications' => $notifications,
        ]);
    }

    public function destroy($id)
    {
        DB::table('notifications')->delete($id);

        return redirect()->route('notifications.index');
    }
}
