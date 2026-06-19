<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['group' => 'general',   'key' => 'site_name_en',      'value' => 'Nepal Interledger Financial Network', 'type' => 'text',  'display_name' => 'Site Name (EN)',      'is_public' => true],
            ['group' => 'general',   'key' => 'site_name_ne',      'value' => 'नेपाल इन्टरलेजर फाइनान्सियल नेटवर्क',   'type' => 'text',  'display_name' => 'Site Name (NE)',      'is_public' => true],
            ['group' => 'general',   'key' => 'site_tagline_en',   'value' => 'Open Payment Infrastructure for Nepal', 'type' => 'text',  'display_name' => 'Tagline (EN)',        'is_public' => true],
            ['group' => 'general',   'key' => 'site_tagline_ne',   'value' => 'नेपालको लागि खुला भुक्तानी पूर्वाधार',    'type' => 'text',  'display_name' => 'Tagline (NE)',        'is_public' => true],
            ['group' => 'contact',   'key' => 'email',             'value' => 'info@nifn.org.np',                     'type' => 'text',  'display_name' => 'Contact Email',       'is_public' => true],
            ['group' => 'contact',   'key' => 'phone',             'value' => '+977-1-XXXXXXX',                       'type' => 'text',  'display_name' => 'Phone',               'is_public' => true],
            ['group' => 'contact',   'key' => 'address_en',        'value' => 'Kathmandu, Nepal',                     'type' => 'text',  'display_name' => 'Address (EN)',        'is_public' => true],
            ['group' => 'social',    'key' => 'facebook_url',      'value' => '',                                     'type' => 'url',   'display_name' => 'Facebook URL',        'is_public' => true],
            ['group' => 'social',    'key' => 'twitter_url',       'value' => '',                                     'type' => 'url',   'display_name' => 'Twitter URL',         'is_public' => true],
            ['group' => 'social',    'key' => 'linkedin_url',      'value' => '',                                     'type' => 'url',   'display_name' => 'LinkedIn URL',        'is_public' => true],
            ['group' => 'social',    'key' => 'github_url',        'value' => 'https://github.com/nifn',              'type' => 'url',   'display_name' => 'GitHub URL',          'is_public' => true],
            ['group' => 'developer', 'key' => 'portal_name',       'value' => 'NIFN Developer Portal',                'type' => 'text',  'display_name' => 'Dev Portal Name',     'is_public' => true],
            ['group' => 'developer', 'key' => 'portal_description','value' => 'Build interoperable financial services with the National Interoperability Framework.', 'type' => 'textarea', 'display_name' => 'Dev Portal Description', 'is_public' => true],
            ['group' => 'seo',       'key' => 'meta_description',  'value' => 'Connecting Nepal to the global interledger network for inclusive financial services.', 'type' => 'textarea', 'display_name' => 'Default Meta Description', 'is_public' => true],
            ['group' => 'seo',       'key' => 'meta_keywords',     'value' => 'NIFN, Nepal, Interledger, payment, fintech', 'type' => 'text', 'display_name' => 'Default Meta Keywords', 'is_public' => true],
        ];

        foreach ($settings as $i => $s) {
            DB::table('settings')->updateOrInsert(
                ['group' => $s['group'], 'key' => $s['key']],
                array_merge($s, ['sort_order' => $i, 'created_at' => now(), 'updated_at' => now()])
            );
        }

        $this->command->info('Settings seeded.');
    }
}
