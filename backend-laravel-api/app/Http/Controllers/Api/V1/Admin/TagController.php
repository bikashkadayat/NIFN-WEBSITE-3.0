<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tags = Tag::with('translations')->orderBy('name')->get();

        return response()->json(['data' => $tags]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'translations'             => ['required', 'array'],
            'translations.*.locale'    => ['required', 'string', 'size:2'],
            'translations.*.name'      => ['required', 'string', 'max:255'],
        ]);

        $tag = DB::transaction(function () use ($request) {
            $enTrans = collect($request->translations)->firstWhere('locale', 'en')
                ?? $request->translations[0];
            $slug = $request->slug ?? Str::slug($enTrans['name']);

            $tag = Tag::create([
                'name' => $enTrans['name'],
                'slug' => $slug,
            ]);

            foreach ($request->translations as $trans) {
                $transSlug = $trans['locale'] === 'en'
                    ? $slug
                    : (Str::slug($trans['name']) . '-' . $trans['locale']);
                $tag->translations()->create([
                    'locale' => $trans['locale'],
                    'name'   => $trans['name'],
                    'slug'   => $trans['slug'] ?? $transSlug,
                ]);
            }

            return $tag;
        });

        return response()->json([
            'data'    => $tag->load('translations'),
            'message' => 'Tag created.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $tag = Tag::with('translations')->findOrFail($id);

        return response()->json(['data' => $tag]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $tag = Tag::findOrFail($id);

        DB::transaction(function () use ($request, $tag) {
            $enTrans = collect($request->translations ?? [])->firstWhere('locale', 'en');
            if ($enTrans) {
                $tag->update([
                    'name' => $enTrans['name'],
                    'slug' => $request->slug ?? Str::slug($enTrans['name']),
                ]);
            }

            foreach ($request->translations ?? [] as $trans) {
                $tag->translations()->updateOrCreate(
                    ['locale' => $trans['locale']],
                    ['name' => $trans['name'], 'slug' => $trans['slug'] ?? Str::slug($trans['name'])]
                );
            }
        });

        return response()->json([
            'data'    => $tag->fresh('translations'),
            'message' => 'Tag updated.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        Tag::findOrFail($id)->delete();

        return response()->json(['message' => 'Tag deleted.']);
    }
}
