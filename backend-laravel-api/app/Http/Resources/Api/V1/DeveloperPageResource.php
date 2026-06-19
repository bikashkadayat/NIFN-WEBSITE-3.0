<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeveloperPageResource extends JsonResource
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
            'body' => $translation?->body,
            'excerpt' => $translation?->excerpt,
            'category' => $this->category,
            'icon' => $this->icon,
            'parent_id' => $this->parent_id,
            'sort_order' => $this->sort_order,
            'seo_title' => $translation?->seo_title,
            'seo_description' => $translation?->seo_description,
            'seo_keywords' => $translation?->seo_keywords,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}