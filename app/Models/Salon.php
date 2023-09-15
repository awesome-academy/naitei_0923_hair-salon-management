<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Salon extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function salonRoles(): BelongsToMany
    {
        return $this->belongsToMany(SalonRole::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function registration(): HasOne
    {
        return $this->hasOne(Registration::class, 'owner_email', 'email');
    }

    public function package(): HasOne
    {
        return $this->hasOne(Package::class);
    }
}
