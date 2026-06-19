<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\DownloadCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DownloadCategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = DownloadCategory::with('translations')->orderBy('sort_order')->get();

        return response()->json(['data' => $categories]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'sort_order'                => ['nullable', 'integer', 'min:0'],
            'is_active'                 => ['boolean'],
            'translations'              => ['required', 'array'],
            'translations.*.locale'     => ['required', 'string', 'size:2'],
            'translations.*.name'       => ['required', 'string', 'max:255'],
            'translations.*.slug'       => ['required', 'string', 'max:255'],
        ]);

        $category = DB::transaction(function () use ($request) {
            $category = DownloadCategory::create([
                'sort_order' => $request->sort_order ?? 0,
                'is_active'  => $request->boolean('is_active', true),
            ]);

            foreach ($request->translations as $trans) {
                $category->translations()->create([
                    'locale' => $trans['locale'],
                    'title'  => $trans['title'] ?? $trans['name'],
                    'slug'   => $trans['slug'],
                ]);
            }

            return $category;
        });

        return response()->json([
            'data'    => $category->load('translations'),
            'message' => 'Download category created.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $category = DownloadCategory::with(['translations', 'downloads'])->findOrFail($id);

        return response()->json(['data' => $category]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $category = DownloadCategory::findOrFail($id);

        DB::transaction(function () use ($request, $category) {
            $category->update(array_filter([
                'sort_order' => $request->sort_order ?? $category->sort_order,
                'is_active'  => $request->has('is_active') ? $request->boolean('is_active') : $category->is_active,
            ], fn ($v) => $v !== null));

            foreach ($request->translations ?? [] as $trans) {
                $category->translations()->updateOrCreate(
                    ['locale' => $trans['locale']],
                    ['title' => $trans['title'] ?? $trans['name'], 'slug' => $trans['slug']]
                );
            }
        });

        return response()->json([
            'data'    => $category->fresh('translations'),
            'message' => 'Download category updated.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        DownloadCategory::findOrFail($id)->delete();

        return response()->json(['message' => 'Download category deleted.']);
    }
}
