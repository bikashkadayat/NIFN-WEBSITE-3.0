<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Media::orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $query->where('original_name', 'LIKE', '%' . $request->search . '%');
        }

        if ($request->has('type')) {
            $query->where('mime_type', 'LIKE', $request->type . '%');
        }

        $media = $query->paginate($request->integer('per_page', 24));

        return response()->json($media);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file'     => ['required', 'file', 'max:20480'],
            'alt_text' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('file');
        $path = $file->store('media/' . date('Y/m'), 'public');

        [$width, $height] = $this->getImageDimensions($file);

        $media = Media::create([
            'original_name'  => $file->getClientOriginalName(),
            'file_path'      => $path,
            'mime_type'      => $file->getMimeType(),
            'disk'           => 'public',
            'file_size'      => $file->getSize(),
            'original_width' => $width,
            'original_height' => $height,
            'alt_text'       => $request->alt_text,
        ]);

        return response()->json([
            'data' => array_merge($media->toArray(), ['url' => $media->url]),
            'message' => 'File uploaded.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $media = Media::findOrFail($id);

        return response()->json([
            'data' => array_merge($media->toArray(), ['url' => $media->url]),
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $media = Media::findOrFail($id);

        $request->validate([
            'alt_text' => ['nullable', 'string', 'max:255'],
        ]);

        $media->update(['alt_text' => $request->alt_text]);

        return response()->json(['data' => $media, 'message' => 'Media updated.']);
    }

    public function destroy(string $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        Storage::disk('public')->delete($media->file_path);
        $media->delete();

        return response()->json(['message' => 'Media deleted.']);
    }

    private function getImageDimensions($file): array
    {
        try {
            if (str_starts_with($file->getMimeType(), 'image/')) {
                [$w, $h] = getimagesize($file->getPathname());
                return [$w ?? null, $h ?? null];
            }
        } catch (\Throwable) {}

        return [null, null];
    }
}
