<?php

namespace Database\Factories;

use App\Models\Registration;
use Illuminate\Database\Eloquent\Factories\Factory;

class SalonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'owner_email' => Registration::all()->pluck('email')->unique()->random(),
            'name' => $this->faker->text(),
            'address' => $this->faker->address(),
            'registration_package' => $this->faker->numberBetween(0,3),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
