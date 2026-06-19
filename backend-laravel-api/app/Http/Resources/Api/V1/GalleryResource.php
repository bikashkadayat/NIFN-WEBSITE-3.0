<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryResource extends JsonResource
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
            'image_count' => $this->whenLoaded('galleryImages', function () {
                return $this->galleryImages->count();
            }),
            'event_date' => $this->event_date?->toISOString(),
        ];
    }
}