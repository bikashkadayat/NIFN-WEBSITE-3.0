<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreNewsRequest;
use App\Http\Requests\Admin\UpdateNewsRequest;
use App\Models\News;
use App\Models\NewsTranslation;
use App\Services\RevalidationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = News::with(['translations', 'category.translations', 'tags', 'featuredImage'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('translations', fn ($q) =>
                $q->where('title', 'LIKE', "%{$search}%")
            );
        }

        if ($request->filled('status')) {
            $query->where('is_published', $request->status === 'published');
        }

        return response()->json($query->paginate($request->integer('per_page', 20)));
    }

    public function store(StoreNewsRequest $request): JsonResponse
    {
        $news = DB::transaction(function () use ($request) {
            $news = News::create([
                'category_id'       => $request->news_category_id ?? $request->category_id,
                'featured_image_id' => $request->featured_image_id,
                'is_published'      => $request->boolean('is_published', false),
                'is_featured'       => $request->boolean('is_featured', false),
                'is_breaking'       => $request->boolean('is_breaking', false),
                'published_at'      => $request->is_published ? ($request->published_at ?? now()) : null,
            ]);

            foreach ($request->translations as $trans) {
                $news->translations()->create([
                    'locale'          => $trans['locale'],
                    'title'           => $trans['title'],
                    'slug'            => $this->generateUniqueSlug($trans['slug'] ?? Str::slug($trans['title']), $news->id),
                    'excerpt'         => $trans['excerpt'] ?? null,
                    'body'            => $trans['body'] ?? null,
                    'seo_title'       => $trans['seo_title'] ?? null,
                    'seo_description' => $trans['seo_description'] ?? null,
                    'seo_keywords'    => $trans['seo_keywords'] ?? null,
                ]);
            }

            if ($request->has('tag_ids')) {
                $news->tags()->sync($request->tag_ids);
            }

            return $news;
        });

        RevalidationService::trigger('website', 'news');

        return response()->json([
            'data'    => $news->load(['translations', 'category', 'tags', 'featuredImage']),
            'message' => 'News article created successfully.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $news = News::with(['translations', 'category.translations', 'tags', 'featuredImage'])
            ->findOrFail($id);

        return response()->json(['data' => $news]);
    }

    public function update(UpdateNewsRequest $request, string $id): JsonResponse
    {
        $news = News::findOrFail($id);

        DB::transaction(function () use ($request, $news) {
            $isPublished = $request->has('is_published')
                ? $request->boolean('is_published')
                : $news->is_published;

            $news->update([
                'category_id'       => $request->news_category_id ?? $request->category_id ?? $news->category_id,
                'featured_image_id' => $request->featured_image_id ?? $news->featured_image_id,
                'is_published'      => $isPublished,
                'is_featured'       => $request->has('is_featured') ? $request->boolean('is_featured') : $news->is_featured,
                'is_breaking'       => $request->has('is_breaking') ? $request->boolean('is_breaking') : $news->is_breaking,
                'published_at'      => $request->has('published_at') ? $request->published_at : ($isPublished && !$news->published_at ? now() : $news->published_at),
            ]);

            foreach ($request->translations ?? [] as $trans) {
                $locale = $trans['locale'];
                $existing = $news->translations()->where('locale', $locale)->first();
                $slug = $trans['slug'] ?? ($existing?->slug ?? Str::slug($trans['title'] ?? ''));

                $news->translations()->updateOrCreate(
                    ['locale' => $locale],
                    [
                        'title'           => $trans['title'] ?? $existing?->title,
                        'slug'            => $this->generateUniqueSlug($slug, $news->id, $existing?->id),
                        'excerpt'         => $trans['excerpt'] ?? $existing?->excerpt,
                        'body'            => $trans['body'] ?? $existing?->body,
                        'seo_title'       => $trans['seo_title'] ?? $existing?->seo_title,
                        'seo_description' => $trans['seo_description'] ?? $existing?->seo_description,
                        'seo_keywords'    => $trans['seo_keywords'] ?? $existing?->seo_keywords,
                    ]
                );
            }

            if ($request->has('tag_ids')) {
                $news->tags()->sync($request->tag_ids);
            }
        });

        RevalidationService::trigger('website', 'news');

        return response()->json([
            'data'    => $news->fresh(['translations', 'category', 'tags', 'featuredImage']),
            'message' => 'News article updated successfully.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        News::findOrFail($id)->delete();

        RevalidationService::trigger('website', 'news');

        return response()->json(['message' => 'News article deleted.']);
    }

    private function generateUniqueSlug(string $slug, string $newsId, ?string $excludeTranslationId = null): string
    {
        $base  = Str::slug($slug);
        $final = $base;
        $i     = 2;

        while (
            NewsTranslation::where('slug', $final)
                ->where('news_id', '!=', $newsId)
                ->when($excludeTranslationId, fn ($q) => $q->where('id', '!=', $excludeTranslationId))
                ->exists()
        ) {
            $final = $base . '-' . $i++;
        }

        return $final;
    }
}
