<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function salon(): BelongsTo
    {
        return $this->belongsTo(Salon::class);
    }
}
