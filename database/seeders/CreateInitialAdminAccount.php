<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateInitialAdminAccount extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'system_role_id' => 1,
            'phone' => '01234556789',
            'email' => 'superadmin@gmail.com',
            'password' => Hash::make('12345678'),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' =>now(),
        ]);
    }
}
