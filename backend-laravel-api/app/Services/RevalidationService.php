<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RevalidationService
{
    /**
     * @param string $target  'website' | 'developer' | 'all'
     * @param string $type    'content' | 'news' | 'banner' | 'gallery' | 'menu' | 'all'
     * @param string|null $slug  Optional slug for per-item invalidation
     */
    public static function trigger(string $target = 'all', string $type = 'all', ?string $slug = null): void
    {
        $secret = config('app.revalidate_secret', env('REVALIDATE_SECRET', ''));
        $urls = [];

        if ($target === 'website' || $target === 'all') {
            $urls[] = env('FRONTEND_URL', 'http://localhost:3007') . '/api/revalidate';
        }
        if ($target === 'developer' || $target === 'all') {
            $urls[] = env('DEVELOPER_PORTAL_URL', 'http://localhost:3006') . '/api/revalidate';
        }

        $payload = ['type' => $type];
        if ($slug) $payload['slug'] = $slug;

        foreach ($urls as $url) {
            try {
                Http::timeout(3)
                    ->withHeaders(['x-revalidate-secret' => $secret])
                    ->post($url, $payload);
                Log::info("Revalidation triggered for {$url} (type={$type}" . ($slug ? ", slug={$slug}" : '') . ')');
            } catch (\Exception $e) {
                Log::warning("Revalidation failed for {$url}: " . $e->getMessage());
            }
        }
    }
}
