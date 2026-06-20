<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryRequest;
use App\Http\Requests\Admin\UpdateGalleryRequest;
use App\Models\Gallery;
use App\Models\GalleryTranslation;
use App\Services\RevalidationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $galleries = Gallery::with(['translations', 'coverImage'])
            ->orderBy('sort_order')
            ->paginate($request->integer('per_page', 20));

        return response()->json($galleries);
    }

    public function store(StoreGalleryRequest $request): JsonResponse
    {
        $gallery = DB::transaction(function () use ($request) {
            $gallery = Gallery::create([
                'cover_image_id' => $request->cover_image_id,
                'is_published'   => $request->boolean('is_published', true),
                'sort_order'     => $request->sort_order ?? 0,
                'event_date'     => $request->event_date,
            ]);

            // Top-level slug from the form (applies to English translation)
            $topLevelSlug = $request->slug;

            foreach ($request->translations ?? [] as $trans) {
                $locale = $trans['locale'];
                $title  = $trans['title'] ?? '';

                // Skip translations with no title
                if (empty(trim($title))) {
                    continue;
                }

                // English: prefer top-level slug, fall back to auto-generate
                // Other locales: always auto-generate from title
                if ($locale === 'en' && !empty($topLevelSlug)) {
                    $slug = $this->uniqueSlug($topLevelSlug, $locale, $gallery->id);
                } else {
                    $slug = $this->uniqueSlug(Str::slug($title), $locale, $gallery->id);
                }

                $gallery->translations()->create([
                    'locale'      => $locale,
                    'title'       => $title,
                    'slug'        => $slug,
                    'description' => $trans['description'] ?? null,
                ]);
            }

            return $gallery;
        });

        RevalidationService::trigger('website', 'gallery', $gallery->slug);

        return response()->json([
            'data'    => $gallery->load('translations'),
            'message' => 'Gallery created.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $gallery = Gallery::with(['translations', 'coverImage', 'galleryImages'])->findOrFail($id);

        return response()->json(['data' => $gallery]);
    }

    public function update(UpdateGalleryRequest $request, string $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);

        DB::transaction(function () use ($request, $gallery) {
            $gallery->update(array_filter([
                'cover_image_id' => $request->cover_image_id ?? $gallery->cover_image_id,
                'is_published'   => $request->has('is_published') ? $request->boolean('is_published') : $gallery->is_published,
                'sort_order'     => $request->sort_order ?? $gallery->sort_order,
                'event_date'     => $request->event_date ?? $gallery->event_date,
            ], fn ($v) => $v !== null));

            // Top-level slug from the form (applies to English translation)
            $topLevelSlug = $request->slug;

            foreach ($request->translations ?? [] as $trans) {
                $locale   = $trans['locale'];
                $title    = $trans['title'] ?? '';
                $existing = $gallery->translations()->where('locale', $locale)->first();

                // Skip translations with no title (and no existing one to keep)
                if (empty(trim($title))) {
                    continue;
                }

                // Determine slug
                if ($locale === 'en' && !empty($topLevelSlug)) {
                    $slug = $this->uniqueSlug($topLevelSlug, $locale, $gallery->id, $existing?->id);
                } elseif (!empty($trans['slug'])) {
                    $slug = $this->uniqueSlug($trans['slug'], $locale, $gallery->id, $existing?->id);
                } elseif ($existing?->slug) {
                    $slug = $existing->slug;
                } else {
                    $slug = $this->uniqueSlug(Str::slug($title), $locale, $gallery->id, $existing?->id);
                }

                $gallery->translations()->updateOrCreate(
                    ['locale' => $locale],
                    [
                        'title'       => $title,
                        'slug'        => $slug,
                        'description' => $trans['description'] ?? $existing?->description,
                    ]
                );
            }
        });

        RevalidationService::trigger('website', 'gallery', $gallery->fresh()->slug);

        return response()->json([
            'data'    => $gallery->fresh('translations'),
            'message' => 'Gallery updated.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);
        $slug = $gallery->slug;
        $gallery->delete();

        RevalidationService::trigger('website', 'gallery', $slug);

        return response()->json(['message' => 'Gallery deleted.']);
    }

    private function uniqueSlug(string $base, string $locale, string $galleryId, ?string $excludeTranslationId = null): string
    {
        $base  = Str::slug($base) ?: ('gallery-' . substr(uniqid(), -6));
        $slug  = $base;
        $i     = 2;

        while (
            GalleryTranslation::where('locale', $locale)
                ->where('slug', $slug)
                ->where('gallery_id', '!=', $galleryId)
                ->when($excludeTranslationId, fn ($q) => $q->where('id', '!=', $excludeTranslationId))
                ->exists()
        ) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }
}
