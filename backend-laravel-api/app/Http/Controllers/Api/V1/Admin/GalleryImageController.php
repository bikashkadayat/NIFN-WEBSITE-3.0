<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\GalleryImage;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryImageController extends Controller
{
    public function index(string $galleryId): JsonResponse
    {
        $gallery = Gallery::findOrFail($galleryId);

        return response()->json([
            'data' => $gallery->galleryImages()->with('media')->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request, string $galleryId): JsonResponse
    {
        $gallery = Gallery::findOrFail($galleryId);

        $request->validate([
            'images'     => ['required', 'array'],
            'images.*'   => ['required', 'image', 'max:20480'],
            'captions'   => ['nullable', 'array'],
            'captions.*' => ['nullable', 'string'],
        ]);

        $uploaded = [];
        $maxOrder = $gallery->galleryImages()->max('sort_order') ?? 0;

        foreach ($request->file('images') as $i => $file) {
            $path = $file->store('galleries/' . $galleryId, 'public');

            $media = Media::create([
                'original_name' => $file->getClientOriginalName(),
                'file_path'     => $path,
                'mime_type'     => $file->getMimeType(),
                'disk'          => 'public',
                'file_size'     => $file->getSize(),
            ]);

            $image = GalleryImage::create([
                'gallery_id' => $gallery->id,
                'media_id'   => $media->id,
                'sort_order' => $maxOrder + 1 + $i,
                'caption_en' => $request->captions[$i] ?? null,
                'is_cover'   => false,
            ]);

            $uploaded[] = $image->load('media');
        }

        return response()->json([
            'data'    => $uploaded,
            'message' => count($uploaded) . ' image(s) uploaded.',
        ], 201);
    }

    public function update(Request $request, string $galleryId, string $imageId): JsonResponse
    {
        $image = GalleryImage::where('gallery_id', $galleryId)->findOrFail($imageId);

        $request->validate([
            'caption_en' => ['nullable', 'string', 'max:500'],
            'caption_ne' => ['nullable', 'string', 'max:500'],
            'is_cover'   => ['sometimes', 'boolean'],
        ]);

        if ($request->has('is_cover') && $request->boolean('is_cover')) {
            GalleryImage::where('gallery_id', $galleryId)
                ->where('id', '!=', $imageId)
                ->update(['is_cover' => false]);
        }

        $image->update([
            'caption_en' => $request->has('caption_en') ? $request->caption_en : $image->caption_en,
            'caption_ne' => $request->has('caption_ne') ? $request->caption_ne : $image->caption_ne,
            'is_cover'   => $request->has('is_cover') ? $request->boolean('is_cover') : $image->is_cover,
        ]);

        return response()->json([
            'data'    => $image->fresh('media'),
            'message' => 'Image updated.',
        ]);
    }

    public function reorder(Request $request, string $galleryId): JsonResponse
    {
        $request->validate([
            'order'   => ['required', 'array'],
            'order.*' => ['required', 'uuid'],
        ]);

        Gallery::findOrFail($galleryId);

        foreach ($request->order as $i => $imageId) {
            GalleryImage::where('id', $imageId)
                ->where('gallery_id', $galleryId)
                ->update(['sort_order' => $i + 1]);
        }

        return response()->json(['message' => 'Images reordered.']);
    }

    public function destroy(string $galleryId, string $imageId): JsonResponse
    {
        $image = GalleryImage::where('gallery_id', $galleryId)->findOrFail($imageId);
        $image->delete();

        return response()->json(['message' => 'Image removed.']);
    }
}
