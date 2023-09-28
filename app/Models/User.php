<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function getSystemRoleAttribute()
    {
        return SystemRole::find($this->system_role_id)->name;
    }

    public function getSalonRoleAttribute()
    {
        if (session()->has('selectedSalon')) {
            $salon_role_id = DB::table('salon_user')->where('user_id', $this->id)
                ->where('salon_id', session('selectedSalon'))->get()->first()->salon_role_id;

            return SalonRole::find($salon_role_id)->name;
        } else {
            return null;
        }
        return SystemRole::find($this->system_role_id)->name;
    }

    protected $appends = ['system_role', 'salon_role'];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function systemRole(): BelongsTo
    {
        return $this->belongsTo(SystemRole::class);
    }

    public function salonRoles(): BelongsToMany
    {
        return $this->belongsToMany(SalonRole::class);
    }

    public function salons(): BelongsToMany
    {
        return $this->belongsToMany(Salon::class);
    }

    protected function getFullNameAttribute()
    {
        return $this->attributes['first_name'] . ' ' . $this->attributes['last_name'];
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
