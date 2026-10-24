<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seeds a local admin login. Refuses to run outside local/testing so a
     * known password can never reach a real environment.
     */
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            $this->command?->error('DatabaseSeeder only seeds local/testing environments.');

            return;
        }

        User::query()->firstOrCreate(
            ['email' => 'admin@example.test'],
            [
                'name' => 'Admin',
                'role' => User::ROLE_ADMIN,
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        $this->command?->info('Admin login: admin@example.test / password');
    }
}
