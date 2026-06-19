<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['slug' => 'super-admin', 'name' => 'Super Admin'],
            ['slug' => 'admin',       'name' => 'Admin'],
            ['slug' => 'editor',      'name' => 'Editor'],
            ['slug' => 'viewer',      'name' => 'Viewer'],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['slug' => $role['slug']],
                array_merge($role, [
                    'id'         => (string) Str::uuid(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        $this->command->info('Roles seeded successfully.');
    }
}
