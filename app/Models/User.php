<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
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

    protected $appends = ['system_role'];
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
}
