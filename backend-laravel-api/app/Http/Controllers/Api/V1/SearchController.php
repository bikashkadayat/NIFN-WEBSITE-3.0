<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\SearchResultResource;
use App\Models\Content;
use App\Models\Gallery;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q      = $request->query('q', '');
        $locale = $request->query('locale', 'en');

        if (strlen($q) < 2) {
            return response()->json([
                'data'    => ['news' => [], 'galleries' => [], 'pages' => []],
                'message' => 'Query must be at least 2 characters',
            ]);
        }

        $news = News::with(['translations', 'featuredImage', 'category.translations'])
            ->where('is_published', true)
            ->whereHas('translations', function ($query) use ($q, $locale) {
                $query->where('locale', $locale)
                    ->where(function ($sub) use ($q) {
                        $sub->where('title', 'LIKE', "%{$q}%")
                            ->orWhere('body', 'LIKE', "%{$q}%");
                    });
            })
            ->limit(10)
            ->get();

        $galleries = Gallery::with(['translations', 'coverImage'])
            ->where('is_published', true)
            ->whereHas('translations', function ($query) use ($q, $locale) {
                $query->where('locale', $locale)
                    ->where('title', 'LIKE', "%{$q}%");
            })
            ->limit(10)
            ->get();

        $pages = Content::with(['translations', 'featuredImage'])
            ->where('is_published', true)
            ->whereHas('translations', function ($query) use ($q, $locale) {
                $query->where('locale', $locale)
                    ->where(function ($sub) use ($q) {
                        $sub->where('title', 'LIKE', "%{$q}%")
                            ->orWhere('body', 'LIKE', "%{$q}%");
                    });
            })
            ->limit(10)
            ->get();

        return response()->json([
            'data' => [
                'news'      => SearchResultResource::collection($news)->resolve($request),
                'galleries' => SearchResultResource::collection($galleries)->resolve($request),
                'pages'     => SearchResultResource::collection($pages)->resolve($request),
            ],
        ]);
    }
}
