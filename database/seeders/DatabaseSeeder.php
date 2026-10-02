<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Super Admin
        User::updateOrCreate(
            ['email' => 'superadmin@bgc.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'is_superadmin' => true,
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Member User
        User::updateOrCreate(
            ['email' => 'user@bgc.com'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('password'),
                'is_superadmin' => false,
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );
    }
}
