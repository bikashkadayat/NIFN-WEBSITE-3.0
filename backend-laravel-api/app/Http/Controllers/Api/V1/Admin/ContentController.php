<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreContentRequest;
use App\Http\Requests\Admin\UpdateContentRequest;
use App\Models\Content;
use App\Services\RevalidationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $contents = Content::with(['translations', 'featuredImage'])
            ->orderBy('sort_order')
            ->paginate($request->integer('per_page', 20));

        return response()->json($contents);
    }

    public function store(StoreContentRequest $request): JsonResponse
    {
        $content = DB::transaction(function () use ($request) {
            $content = Content::create([
                'slug'              => $request->slug,
                'portal_type'       => $request->portal_type ?? 'website',
                'featured_image_id' => $request->featured_image_id,
                'is_published'      => $request->boolean('is_published', true),
                'sort_order'        => $request->sort_order ?? 0,
            ]);

            foreach ($request->translations as $trans) {
                $content->translations()->create([
                    'locale'          => $trans['locale'],
                    'title'           => $trans['title'],
                    'body'            => $trans['body'] ?? null,
                    'excerpt'         => $trans['excerpt'] ?? null,
                    'seo_title'       => $trans['seo_title'] ?? null,
                    'seo_description' => $trans['seo_description'] ?? null,
                    'seo_keywords'    => $trans['seo_keywords'] ?? null,
                ]);
            }

            return $content;
        });

        RevalidationService::trigger($content->portal_type ?? 'website', 'content', $content->slug);

        return response()->json([
            'data'    => $content->load('translations'),
            'message' => 'Content created successfully.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $content = Content::with(['translations', 'featuredImage'])->findOrFail($id);

        return response()->json(['data' => $content]);
    }

    public function update(UpdateContentRequest $request, string $id): JsonResponse
    {
        $content = Content::findOrFail($id);

        DB::transaction(function () use ($request, $content) {
            $content->update(array_filter([
                'slug'              => $request->slug ?? $content->slug,
                'portal_type'       => $request->portal_type ?? $content->portal_type,
                'featured_image_id' => $request->featured_image_id,
                'is_published'      => $request->has('is_published') ? $request->boolean('is_published') : $content->is_published,
                'sort_order'        => $request->sort_order ?? $content->sort_order,
            ], fn ($v) => $v !== null));

            foreach ($request->translations ?? [] as $trans) {
                $content->translations()->updateOrCreate(
                    ['locale' => $trans['locale']],
                    [
                        'title'           => $trans['title'],
                        'body'            => $trans['body'] ?? null,
                        'excerpt'         => $trans['excerpt'] ?? null,
                        'seo_title'       => $trans['seo_title'] ?? null,
                        'seo_description' => $trans['seo_description'] ?? null,
                        'seo_keywords'    => $trans['seo_keywords'] ?? null,
                    ]
                );
            }
        });

        RevalidationService::trigger($content->portal_type ?? 'website', 'content', $content->slug);

        return response()->json([
            'data'    => $content->fresh('translations'),
            'message' => 'Content updated successfully.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $content = Content::findOrFail($id);
        $slug = $content->slug;
        $portalType = $content->portal_type;
        $content->delete();

        RevalidationService::trigger($portalType ?? 'website', 'content', $slug);

        return response()->json(['message' => 'Content deleted.']);
    }
}
