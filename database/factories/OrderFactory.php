<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Salon;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'customer_id' => Customer::where('is_active', true)->get()->random()->id,
            'salon_id' => Salon::where('is_active', true)->get()->random()->id,
            'status' => $this->faker->numberBetween(0, 2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
