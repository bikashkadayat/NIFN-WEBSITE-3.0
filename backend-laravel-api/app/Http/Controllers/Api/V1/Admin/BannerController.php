<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBannerRequest;
use App\Models\Banner;
use App\Services\RevalidationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BannerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $banners = Banner::with(['translations', 'image'])
            ->orderBy('sort_order')
            ->paginate($request->integer('per_page', 20));

        return response()->json($banners);
    }

    public function store(StoreBannerRequest $request): JsonResponse
    {
        $banner = DB::transaction(function () use ($request) {
            $banner = Banner::create([
                'image_id'              => $request->image_id,
                'text_alignment'        => $request->text_alignment ?? 'center',
                'overlay_opacity'       => $request->overlay_opacity ?? 50,
                'primary_button_link'   => $request->primary_button_link,
                'secondary_button_link' => $request->secondary_button_link,
                'sort_order'            => $request->sort_order ?? 0,
                'is_active'             => $request->boolean('is_active', true),
            ]);

            foreach ($request->translations as $trans) {
                $banner->translations()->create([
                    'locale'               => $trans['locale'],
                    'title'                => $trans['title'] ?? null,
                    'subtitle'             => $trans['subtitle'] ?? null,
                    'primary_button_text'  => $trans['primary_button_text'] ?? null,
                    'secondary_button_text' => $trans['secondary_button_text'] ?? null,
                ]);
            }

            return $banner;
        });

        RevalidationService::trigger('website', 'banner');

        return response()->json([
            'data'    => $banner->load('translations'),
            'message' => 'Banner created.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $banner = Banner::with(['translations', 'image'])->findOrFail($id);

        return response()->json(['data' => $banner]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $banner = Banner::findOrFail($id);

        DB::transaction(function () use ($request, $banner) {
            $banner->update(array_filter([
                'image_id'              => $request->image_id ?? $banner->image_id,
                'text_alignment'        => $request->text_alignment ?? $banner->text_alignment,
                'overlay_opacity'       => $request->overlay_opacity ?? $banner->overlay_opacity,
                'primary_button_link'   => $request->primary_button_link ?? $banner->primary_button_link,
                'secondary_button_link' => $request->secondary_button_link ?? $banner->secondary_button_link,
                'sort_order'            => $request->sort_order ?? $banner->sort_order,
                'is_active'             => $request->has('is_active') ? $request->boolean('is_active') : $banner->is_active,
            ], fn ($v) => $v !== null));

            foreach ($request->translations ?? [] as $trans) {
                $banner->translations()->updateOrCreate(
                    ['locale' => $trans['locale']],
                    [
                        'title'                => $trans['title'] ?? null,
                        'subtitle'             => $trans['subtitle'] ?? null,
                        'primary_button_text'  => $trans['primary_button_text'] ?? null,
                        'secondary_button_text' => $trans['secondary_button_text'] ?? null,
                    ]
                );
            }
        });

        RevalidationService::trigger('website', 'banner');

        return response()->json([
            'data'    => $banner->fresh('translations'),
            'message' => 'Banner updated.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        Banner::findOrFail($id)->delete();

        RevalidationService::trigger('website', 'banner');

        return response()->json(['message' => 'Banner deleted.']);
    }
}
