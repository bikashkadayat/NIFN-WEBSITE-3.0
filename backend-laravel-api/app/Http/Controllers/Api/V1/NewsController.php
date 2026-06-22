<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\NewsCollection;
use App\Http\Resources\Api\V1\NewsResource;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::with(['translations', 'category.translations', 'featuredImage'])
            ->published();

        if ($request->has('category')) {
            $query->whereHas('category.translations', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('translations', fn($q) => $q->where('title', 'LIKE', "%{$search}%")->orWhere('body', 'LIKE', "%{$search}%"));
        }

        $query->orderBy('published_at', 'desc');

        if ($request->has('limit')) {
            return NewsResource::collection($query->limit((int) $request->limit)->get());
        }

        return new NewsCollection($query->paginate($request->integer('per_page', 10)));
    }

    public function show(Request $request, string $slug)
    {
        $news = News::with(['translations', 'category.translations', 'featuredImage', 'tags'])
            ->published()
            ->whereHas('translations', fn($q) => $q->where('slug', $slug))
            ->first();

        if (!$news) {
            return response()->json(['success' => false, 'message' => 'News not found.'], 404);
        }

        return new NewsResource($news);
    }
}
