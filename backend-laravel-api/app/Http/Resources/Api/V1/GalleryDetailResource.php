<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryDetailResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $translation = $this->getTranslation($this->resource, $locale);

        return [
            'id' => $this->id,
            'title' => $translation?->title,
            'slug' => $translation?->slug,
            'description' => $translation?->description,
            'cover_image_url' => $this->coverImage?->url,
            'event_date' => $this->event_date?->toISOString(),
            'images' => $this->whenLoaded('galleryImages', function () use ($locale) {
                return $this->galleryImages->sortBy('sort_order')->map(function ($image) use ($locale) {
                    return [
                        'id' => $image->id,
                        'url' => $image->url,
                        'thumbnail_url' => $image->url, // Could be enhanced with thumbnail generation
                        'caption' => $image->getCaptionAttribute($locale),
                        'sort_order' => $image->sort_order,
                    ];
                })->values();
            }),
        ];
    }
}