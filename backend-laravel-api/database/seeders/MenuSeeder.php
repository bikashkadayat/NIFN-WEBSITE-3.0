<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('menu_item_translations')->delete();
        DB::table('menu_items')->delete();
        DB::table('menu_translations')->delete();
        DB::table('menus')->delete();

        $this->createMenu('header', 'Main Navigation', [
            ['title' => 'Home',        'url' => '/',             'sort_order' => 1, 'children' => []],
            ['title' => 'About NIFN',  'url' => '/about',        'sort_order' => 2, 'children' => [
                ['title' => 'About NIFN', 'url' => '/about',      'sort_order' => 1],
                ['title' => 'Our Impact', 'url' => '/impact',     'sort_order' => 2],
                ['title' => 'Technology', 'url' => '/technology', 'sort_order' => 3],
            ]],
            ['title' => 'Ecosystem',   'url' => '/ecosystem',    'sort_order' => 3, 'children' => [
                ['title' => 'Overview',          'url' => '/ecosystem',                          'sort_order' => 1],
                ['title' => 'Developer Portal',  'url' => 'http://localhost:3006', 'target' => '_blank', 'sort_order' => 2],
                ['title' => 'Join Network',      'url' => '/join-network',                       'sort_order' => 3],
            ]],
            ['title' => 'News',        'url' => '/news',          'sort_order' => 4, 'children' => []],
            ['title' => 'Gallery',     'url' => '/gallery',       'sort_order' => 5, 'children' => []],
            ['title' => 'Contact',     'url' => '/contact',       'sort_order' => 6, 'children' => []],
        ]);

        $this->createMenu('footer', 'Footer Navigation', [
            ['title' => 'About',          'url' => '/about',          'sort_order' => 1, 'children' => []],
            ['title' => 'Impact',         'url' => '/impact',         'sort_order' => 2, 'children' => []],
            ['title' => 'Governance',     'url' => '/governance',     'sort_order' => 3, 'children' => []],
            ['title' => 'Partners',       'url' => '/partners',       'sort_order' => 4, 'children' => []],
            ['title' => 'News',           'url' => '/news',           'sort_order' => 5, 'children' => []],
            ['title' => 'Contact',        'url' => '/contact',        'sort_order' => 6, 'children' => []],
            ['title' => 'Privacy Policy', 'url' => '/privacy-policy', 'sort_order' => 7, 'children' => []],
            ['title' => 'Terms',          'url' => '/terms',          'sort_order' => 8, 'children' => []],
        ]);

        $this->command->info('Menus seeded.');
    }

    private function createMenu(string $location, string $title, array $items): void
    {
        $menuId = (string) Str::uuid();
        DB::table('menus')->insert([
            'id' => $menuId, 'location' => $location, 'status' => true,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('menu_translations')->updateOrInsert(
            ['menu_id' => $menuId, 'locale' => 'en'],
            ['title' => $title]
        );

        foreach ($items as $item) {
            $parentId = $this->createMenuItem($menuId, null, $item);
            foreach ($item['children'] ?? [] as $child) {
                $this->createMenuItem($menuId, $parentId, $child);
            }
        }
    }

    private function createMenuItem(string $menuId, ?string $parentId, array $item): string
    {
        $id = (string) Str::uuid();
        DB::table('menu_items')->insert([
            'id'          => $id,
            'menu_id'     => $menuId,
            'parent_id'   => $parentId,
            'type'        => 'url',
            'url'         => $item['url'],
            'target'      => $item['target'] ?? '_self',
            'sort_order'  => $item['sort_order'],
            'depth'       => $parentId ? 1 : 0,
            'status'      => true,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
        DB::table('menu_item_translations')->insert([
            'menu_item_id' => $id,
            'locale'       => 'en',
            'title'        => $item['title'],
        ]);
        return $id;
    }
}
