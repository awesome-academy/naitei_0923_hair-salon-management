<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('packages')->insert([
            [
                'id' => 1,
                'name' => 'Small',
                'staff_number' =>50,
                'customer_number' => 2000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Medium',
                'staff_number' =>100,
                'customer_number' => 5000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Big',
                'staff_number' =>300,
                'customer_number' => 10000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
