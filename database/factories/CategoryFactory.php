<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Salon;

class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->text(),
            'salon_id' => Salon::where('is_active', true)->get()->random()->id,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
