<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryRequest;
use App\Http\Requests\Admin\UpdateGalleryRequest;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

            foreach ($request->translations as $trans) {
                $gallery->translations()->create([
                    'locale'      => $trans['locale'],
                    'title'       => $trans['title'],
                    'slug'        => $trans['slug'],
                    'description' => $trans['description'] ?? null,
                ]);
            }

            return $gallery;
        });

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

            foreach ($request->translations ?? [] as $trans) {
                $gallery->translations()->updateOrCreate(
                    ['locale' => $trans['locale']],
                    [
                        'title'       => $trans['title'],
                        'slug'        => $trans['slug'],
                        'description' => $trans['description'] ?? null,
                    ]
                );
            }
        });

        return response()->json([
            'data'    => $gallery->fresh('translations'),
            'message' => 'Gallery updated.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        Gallery::findOrFail($id)->delete();

        return response()->json(['message' => 'Gallery deleted.']);
    }
}
