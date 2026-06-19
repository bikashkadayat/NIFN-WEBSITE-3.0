<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NewsCategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = NewsCategory::with('translations')
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $categories]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'sort_order'               => ['nullable', 'integer', 'min:0'],
            'is_active'                => ['boolean'],
            'translations'             => ['required', 'array'],
            'translations.*.locale'    => ['required', 'string', 'size:2'],
            'translations.*.name'      => ['required', 'string', 'max:255'],
            'translations.*.slug'      => ['required', 'string', 'max:255'],
            'translations.*.description' => ['nullable', 'string'],
        ]);

        $category = DB::transaction(function () use ($request) {
            $category = NewsCategory::create([
                'sort_order' => $request->sort_order ?? 0,
                'is_active'  => $request->boolean('is_active', true),
            ]);

            foreach ($request->translations as $trans) {
                $category->translations()->create([
                    'locale'      => $trans['locale'],
                    'name'        => $trans['name'],
                    'slug'        => $trans['slug'],
                    'description' => $trans['description'] ?? null,
                ]);
            }

            return $category;
        });

        return response()->json([
            'data'    => $category->load('translations'),
            'message' => 'Category created.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $category = NewsCategory::with(['translations', 'news'])->findOrFail($id);

        return response()->json(['data' => $category]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $category = NewsCategory::findOrFail($id);

        DB::transaction(function () use ($request, $category) {
            $category->update(array_filter([
                'sort_order' => $request->sort_order ?? $category->sort_order,
                'is_active'  => $request->has('is_active') ? $request->boolean('is_active') : $category->is_active,
            ], fn ($v) => $v !== null));

            foreach ($request->translations ?? [] as $trans) {
                $category->translations()->updateOrCreate(
                    ['locale' => $trans['locale']],
                    [
                        'name'        => $trans['name'],
                        'slug'        => $trans['slug'],
                        'description' => $trans['description'] ?? null,
                    ]
                );
            }
        });

        return response()->json([
            'data'    => $category->fresh('translations'),
            'message' => 'Category updated.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        NewsCategory::findOrFail($id)->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}
