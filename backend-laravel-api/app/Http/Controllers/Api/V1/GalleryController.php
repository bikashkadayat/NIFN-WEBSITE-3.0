<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\GalleryDetailResource;
use App\Http\Resources\Api\V1\GalleryResource;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $galleries = Gallery::with(['translations', 'coverImage', 'galleryImages'])
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return GalleryResource::collection($galleries);
    }

    public function show(Request $request, string $slug)
    {
        $gallery = Gallery::with(['translations', 'coverImage', 'galleryImages.media'])
            ->where('is_published', true)
            ->whereHas('translations', function ($q) use ($slug) {
                $q->where('slug', $slug);
            })
            ->firstOrFail();

        return new GalleryDetailResource($gallery);
    }
}
