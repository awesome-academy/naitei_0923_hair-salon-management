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
            'order_id' => function () {
                $order = Order::doesntHave('bill')->where('status', 1)->get()->random();
                
                if ($order) {
                    return $order->id;
                }
            },
            'payment_method' => $this->faker->text(),
            'total' => $this->faker->randomNumber(),
            'cash' => $this->faker->randomNumber(),
            'change' => $this->faker->randomNumber(),
            'status' => $this->faker->numberBetween(0, 1),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
