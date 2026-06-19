<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RevalidationService
{
    public static function trigger(string $type = 'all', ?string $slug = null): void
    {
        $secret = config('app.revalidate_secret', env('REVALIDATE_SECRET', ''));
        $urls = [];

        if ($type === 'website' || $type === 'all') {
            $urls[] = env('FRONTEND_URL', 'http://localhost:3007') . '/api/revalidate';
        }
        if ($type === 'developer' || $type === 'all') {
            $urls[] = env('DEVELOPER_PORTAL_URL', 'http://localhost:3006') . '/api/revalidate';
        }

        $payload = $slug ? ['slug' => $slug, 'tag' => "content-{$slug}", 'path' => "/{$slug}"] : ['tag' => 'all'];

        foreach ($urls as $url) {
            try {
                Http::timeout(3)
                    ->withHeaders(['x-revalidate-secret' => $secret])
                    ->post($url, $payload);
                Log::info("Revalidation triggered for {$url}");
            } catch (\Exception $e) {
                Log::warning("Revalidation failed for {$url}: " . $e->getMessage());
            }
        }
    }
}
