<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        // $admin = User::create([
        //     'name' => 'admin',
        //     'email' => 'admin@example.com',
        //     'password' => Hash::make('password'),
        //     'email_verified_at' => now(),
        //     'timezone' => 'UTC',
        //     'consent_given' => true,
        //     'image' => 'https://ui-avatars.com/api/?name=Admin+User&background=random',
        //     'data_retention_until' => now()->addYears(2),
        // ]);

        // Create test users
        User::factory(200)->create([
            'created_by' => 1,
            'updated_by' => 1,
        ]);
    }
}
