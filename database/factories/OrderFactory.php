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
        $customer = Customer::where('is_active', true)->get()->random();
        return [
            'customer_id' => $customer->id,
            'salon_id' => $customer->salon_id,
            'status' => $this->faker->numberBetween(0, 2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
