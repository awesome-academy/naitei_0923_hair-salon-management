<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory;

    protected $fillable = ['*'];

    public function salons(): HasMany
    {
        return $this->hasMany(Salon::class, 'package_id', 'id');
    }
    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class, 'package_id', 'id');
    }
}
