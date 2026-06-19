<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\DownloadResource;
use App\Models\Download;
use App\Models\DownloadCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = $request->query('locale', 'en');

        $categories = DownloadCategory::with([
            'translations',
            'downloads' => function ($q) {
                $q->with(['translations', 'thumbnail'])
                    ->where('is_active', true)
                    ->orderBy('sort_order');
            },
        ])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $data = $categories->map(function ($category) use ($locale, $request) {
            return [
                'category' => [
                    'id'   => $category->id,
                    'name' => $category->translation($locale)?->name,
                    'slug' => $category->translation($locale)?->slug,
                ],
                'items' => DownloadResource::collection($category->downloads)->resolve($request),
            ];
        })->values();

        return response()->json(['data' => $data]);
    }

    public function file(Request $request, string $id)
    {
        $download = Download::where('is_active', true)->findOrFail($id);

        $download->increment('download_count');

        if ($download->file_path) {
            $path = storage_path('app/public/' . $download->file_path);

            if (file_exists($path)) {
                return response()->download($path, $download->file_name);
            }
        }

        return response()->json(['message' => 'File not found'], 404);
    }
}
