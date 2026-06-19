<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['email' => 'admin@nifn.org.np',      'name' => 'Super Admin',  'role' => 'super_admin'],
            ['email' => 'testadmin@nifn.org.np',   'name' => 'Test Admin',   'role' => 'admin'],
            ['email' => 'editor@nifn.org.np',      'name' => 'Test Editor',  'role' => 'editor'],
            ['email' => 'viewer@nifn.org.np',      'name' => 'Test Viewer',  'role' => 'viewer'],
        ];

        foreach ($users as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => $user['email']],
                array_merge($user, [
                    'id'         => (string) Str::uuid(),
                    'password'   => Hash::make('admin123'),
                    'is_active'  => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        $this->command->info('Users seeded: admin@nifn.org.np / admin123');
    }
}
