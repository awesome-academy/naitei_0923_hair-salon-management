<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Package extends Model
{
    use HasFactory;

    public function salon(): HasOne
    {
        return $this->hasOne(Salon::class, 'package_id', 'id');
    }
    public function registration(): HasOne
    {
        return $this->hasOne(Registration::class, 'package_id', 'id');
    }
}
