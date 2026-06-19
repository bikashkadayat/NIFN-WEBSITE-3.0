<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SitemapController extends Controller
{
    public function news(Request $request): JsonResponse
    {
        $items = News::with('translations')
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->get()
            ->map(function ($news) {
                return [
                    'slug'       => $news->translation()?->slug,
                    'updated_at' => $news->updated_at?->toISOString(),
                ];
            })
            ->filter(fn ($item) => ! empty($item['slug']))
            ->values();

        return response()->json(['data' => $items]);
    }

    public function galleries(Request $request): JsonResponse
    {
        $items = Gallery::with('translations')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($gallery) {
                return [
                    'slug'       => $gallery->translation()?->slug,
                    'updated_at' => $gallery->updated_at?->toISOString(),
                ];
            })
            ->filter(fn ($item) => ! empty($item['slug']))
            ->values();

        return response()->json(['data' => $items]);
    }
}
