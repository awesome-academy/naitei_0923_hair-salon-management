<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\SystemRole;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $systemRoles = SystemRole::all();
        if ($systemRoles->isEmpty()) {
            DB::table('system_roles')->insert(
                [
                    [
                        'id' => 1,
                        'name' => 'super admin',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'id' => 2,
                        'name' => 'user',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]
            );
        }
        $systemRoles = SystemRole::all();
        $systemRoleId = $systemRoles->random()->id;
        return [
            'system_role_id' => $systemRoleId,
            'first_name' => $this->faker->name(),
            'last_name' => $this->faker->name(),
            'phone'=> $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'is_active' => true,
            'remember_token' => Str::random(10),
        ];
    }
}
