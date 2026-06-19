<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            ['slug' => 'about',             'portal_type' => 'website',   'title' => 'About NIFN',                  'body' => '<h2>About NIFN</h2><p>Nepal Interledger Financial Network (NIFN) is building open payment infrastructure for Nepal, connecting financial institutions to the global Interledger Protocol network.</p><p>Our mission is to enable seamless, low-cost, and inclusive financial services across Nepal by building a unified payment layer that works across banks, cooperatives, fintechs, and mobile money providers.</p>'],
            ['slug' => 'impact',            'portal_type' => 'website',   'title' => 'Our Impact',                  'body' => '<h2>Our Impact</h2><p>NIFN is driving financial inclusion across Nepal. We connect underserved communities with affordable, reliable payment services.</p><ul><li>300+ partner institutions</li><li>2M+ transactions processed</li><li>75 districts covered</li></ul>'],
            ['slug' => 'technology',        'portal_type' => 'website',   'title' => 'Technology',                  'body' => '<h2>Our Technology</h2><p>NIFN is built on the Interledger Protocol (ILP), an open standard for sending payments across different networks and currencies. We use Rafiki as the core infrastructure.</p>'],
            ['slug' => 'ecosystem',         'portal_type' => 'website',   'title' => 'Ecosystem Overview',          'body' => '<h2>The NIFN Ecosystem</h2><p>Our ecosystem connects banks, cooperatives, fintech companies, and mobile money providers into a unified network for seamless payments.</p>'],
            ['slug' => 'governance',        'portal_type' => 'website',   'title' => 'Governance',                  'body' => '<h2>Governance</h2><p>NIFN operates under a transparent governance model with representation from member institutions, regulators, and civil society.</p>'],
            ['slug' => 'partners',          'portal_type' => 'website',   'title' => 'Our Partners',                'body' => '<h2>Our Partners</h2><p>NIFN is supported by a growing network of financial institutions, technology partners, and development organizations committed to financial inclusion in Nepal.</p>'],
            ['slug' => 'careers',           'portal_type' => 'website',   'title' => 'Careers',                    'body' => '<h2>Join Our Team</h2><p>We are looking for passionate individuals to help build the future of payments in Nepal.</p>'],
            ['slug' => 'privacy-policy',    'portal_type' => 'website',   'title' => 'Privacy Policy',              'body' => '<h2>Privacy Policy</h2><p>NIFN is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.</p>'],
            ['slug' => 'terms',             'portal_type' => 'website',   'title' => 'Terms of Service',            'body' => '<h2>Terms of Service</h2><p>By using NIFN services, you agree to these terms. Please read them carefully before proceeding.</p>'],
            ['slug' => 'join-network',      'portal_type' => 'website',   'title' => 'Join the Network',            'body' => '<h2>Join the NIFN Network</h2><p>Become part of Nepal\'s open payment infrastructure. Apply to join as a member institution.</p>'],
            ['slug' => 'quick-start',       'portal_type' => 'developer', 'title' => 'Quick Start Guide',           'body' => '<h1>Quick Start</h1><p>Get up and running with the NIFN API in minutes.</p><h2>Prerequisites</h2><ul><li>A registered developer account</li><li>API credentials from the sandbox</li></ul><h2>Installation</h2><pre><code>npm install @nifn/sdk</code></pre>'],
            ['slug' => 'architecture',      'portal_type' => 'developer', 'title' => 'Architecture Overview',       'body' => '<h1>Architecture Overview</h1><p>NIFN is built on the Interledger Protocol (ILP). This document explains the core architectural concepts.</p>'],
            ['slug' => 'open-payments',     'portal_type' => 'developer', 'title' => 'Open Payments API',           'body' => '<h1>Open Payments API</h1><p>The Open Payments API allows you to send and receive payments using the NIFN network.</p>'],
            ['slug' => 'authentication',    'portal_type' => 'developer', 'title' => 'Authentication',              'body' => '<h1>Authentication</h1><p>All API requests must be authenticated using Bearer tokens obtained from the NIFN authorization server.</p>'],
            ['slug' => 'webhooks',          'portal_type' => 'developer', 'title' => 'Webhooks',                    'body' => '<h1>Webhooks</h1><p>NIFN can send webhook notifications to your server when events occur in your account.</p>'],
            ['slug' => 'error-codes',       'portal_type' => 'developer', 'title' => 'Error Codes',                 'body' => '<h1>Error Codes</h1><p>This page documents all error codes returned by the NIFN API.</p>'],
            ['slug' => 'sandbox',           'portal_type' => 'developer', 'title' => 'Sandbox Environment',         'body' => '<h1>Sandbox Environment</h1><p>Test your integration using the NIFN sandbox before going live.</p>'],
            ['slug' => 'sdks',              'portal_type' => 'developer', 'title' => 'SDKs & Libraries',            'body' => '<h1>SDKs & Libraries</h1><p>Official SDKs are available for JavaScript, Python, PHP, and Go.</p>'],
        ];

        foreach ($pages as $i => $page) {
            $existing = DB::table('contents')->where('slug', $page['slug'])->first();
            if (!$existing) {
                $id = (string) Str::uuid();
                DB::table('contents')->insert([
                    'id'          => $id,
                    'slug'        => $page['slug'],
                    'portal_type' => $page['portal_type'],
                    'status'      => 'published',
                    'sort_order'  => $i,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            } else {
                $id = $existing->id;
                DB::table('contents')->where('id', $id)->update([
                    'portal_type' => $page['portal_type'],
                    'status'      => 'published',
                    'updated_at'  => now(),
                ]);
            }

            DB::table('content_translations')->updateOrInsert(
                ['content_id' => $id, 'locale' => 'en'],
                [
                    'title'           => $page['title'],
                    'slug'            => $page['slug'],
                    'body'            => $page['body'],
                    'excerpt'         => '',
                    'seo_title'       => $page['title'] . ' | NIFN',
                    'seo_description' => substr(strip_tags($page['body']), 0, 160),
                    'seo_keywords'    => 'NIFN, Nepal, ' . strtolower($page['title']),
                ]
            );
        }

        $this->command->info('Content pages seeded.');
    }
}
