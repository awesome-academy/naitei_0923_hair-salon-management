<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class BillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'order_id' => Order::where('status', 1)->get()->random()->id,
            'payment_method' => $this->faker->text(),
            'total' => $this->faker->randomNumber(),
            'cash' => $this->faker->randomNumber(),
            'change' => $this->faker->randomNumber(),
            'status' => $this->faker->numberBetween(0, 2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
