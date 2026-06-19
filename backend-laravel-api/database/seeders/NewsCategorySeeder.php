<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NewsCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Events',        'slug' => 'events'],
            ['name' => 'Updates',       'slug' => 'updates'],
            ['name' => 'Announcements', 'slug' => 'announcements'],
            ['name' => 'Press Release', 'slug' => 'press-release'],
        ];

        foreach ($categories as $i => $cat) {
            // Find by translation slug
            $existing = DB::table('news_category_translations')
                ->where('slug', $cat['slug'])->where('locale', 'en')->first();

            if ($existing) {
                $catId = $existing->news_category_id;
            } else {
                $catId = (string) Str::uuid();
                DB::table('news_categories')->insert([
                    'id'         => $catId,
                    'status'     => true,
                    'sort_order' => $i,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('news_category_translations')->updateOrInsert(
                ['news_category_id' => $catId, 'locale' => 'en'],
                ['title' => $cat['name'], 'slug' => $cat['slug'], 'description' => '']
            );
        }

        $this->command->info('News categories seeded.');
    }
}
