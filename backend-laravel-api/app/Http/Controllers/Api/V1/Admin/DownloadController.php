<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDownloadRequest;
use App\Models\Download;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DownloadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $downloads = Download::with(['translations', 'category.translations', 'thumbnail'])
            ->orderBy('sort_order')
            ->paginate($request->integer('per_page', 20));

        return response()->json($downloads);
    }

    public function store(StoreDownloadRequest $request): JsonResponse
    {
        $download = DB::transaction(function () use ($request) {
            $file     = $request->file('file');
            $path     = $file->store('downloads', 'public');

            $download = Download::create([
                'category_id'    => $request->category_id,
                'file_path'      => $path,
                'file_name'      => $file->getClientOriginalName(),
                'file_size'      => $file->getSize(),
                'file_type'      => $file->getMimeType(),
                'thumbnail_id'   => $request->thumbnail_id,
                'sort_order'     => $request->sort_order ?? 0,
                'is_active'      => $request->boolean('is_active', true),
                'download_count' => 0,
            ]);

            foreach ($request->translations as $trans) {
                if (empty(trim($trans['title'] ?? ''))) continue;
                $download->translations()->create([
                    'locale'      => $trans['locale'],
                    'title'       => $trans['title'],
                    'description' => $trans['description'] ?? null,
                ]);
            }

            return $download;
        });

        return response()->json([
            'data'    => $download->load('translations'),
            'message' => 'Download created.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $download = Download::with(['translations', 'category', 'thumbnail'])->findOrFail($id);

        return response()->json(['data' => $download]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $download = Download::findOrFail($id);

        // Decode translations if sent as JSON string via FormData
        $rawTranslations = $request->input('translations');
        $translations = is_string($rawTranslations)
            ? (json_decode($rawTranslations, true) ?? [])
            : ($rawTranslations ?? []);

        DB::transaction(function () use ($request, $download, $translations) {
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $path = $file->store('downloads', 'public');
                $download->update([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getMimeType(),
                ]);
            }

            $download->update(array_filter([
                'category_id'  => $request->category_id ?? $download->category_id,
                'thumbnail_id' => $request->thumbnail_id ?? $download->thumbnail_id,
                'sort_order'   => $request->sort_order ?? $download->sort_order,
                'is_active'    => $request->has('is_active') ? $request->boolean('is_active') : $download->is_active,
            ], fn ($v) => $v !== null));

            foreach ($translations as $trans) {
                if (empty(trim($trans['title'] ?? ''))) continue;
                $download->translations()->updateOrCreate(
                    ['locale' => $trans['locale']],
                    [
                        'title'       => $trans['title'],
                        'description' => $trans['description'] ?? null,
                    ]
                );
            }
        });

        return response()->json([
            'data'    => $download->fresh('translations'),
            'message' => 'Download updated.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        Download::findOrFail($id)->delete();

        return response()->json(['message' => 'Download deleted.']);
    }
}
