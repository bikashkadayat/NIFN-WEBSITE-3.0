<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\GalleryImage;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryImageController extends Controller
{
    public function index(string $galleryId): JsonResponse
    {
        $gallery = Gallery::findOrFail($galleryId);

        return response()->json([
            'data' => $gallery->galleryImages()->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request, string $galleryId): JsonResponse
    {
        $gallery = Gallery::findOrFail($galleryId);

        $request->validate([
            'images'          => ['required', 'array'],
            'images.*'        => ['required', 'image', 'max:10240'],
            'captions'        => ['nullable', 'array'],
            'captions.*'      => ['nullable', 'string'],
        ]);

        $uploaded = [];

        foreach ($request->file('images') as $i => $file) {
            $path = $file->store('galleries/' . $galleryId, 'public');

            $media = Media::create([
                'original_name'  => $file->getClientOriginalName(),
                'file_path'      => $path,
                'mime_type'      => $file->getMimeType(),
                'disk'           => 'public',
                'file_size'      => $file->getSize(),
            ]);

            $maxOrder = $gallery->galleryImages()->max('sort_order') ?? 0;

            $image = GalleryImage::create([
                'gallery_id' => $gallery->id,
                'media_id'   => $media->id,
                'sort_order' => $maxOrder + 1,
                'caption_en' => $request->captions[$i] ?? null,
            ]);

            $uploaded[] = $image;
        }

        return response()->json([
            'data'    => $uploaded,
            'message' => count($uploaded) . ' image(s) uploaded.',
        ], 201);
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
