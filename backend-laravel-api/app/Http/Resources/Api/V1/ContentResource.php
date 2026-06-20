<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContentResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $translation = $this->getTranslation($this->resource, $locale);

        return [
            'id' => $this->id,
            'title' => $translation?->title,
            'slug' => $this->slug,
            'body' => $translation?->body,
            'excerpt' => $translation?->excerpt,
            'featured_image_url' => $this->featuredImage?->url,
            'seo_title' => $translation?->seo_title ?? $translation?->title,
            'seo_description' => $translation?->seo_description,
            'seo_keywords' => $translation?->seo_keywords,
            'portal_type' => $this->portal_type,
        ];
    }
}