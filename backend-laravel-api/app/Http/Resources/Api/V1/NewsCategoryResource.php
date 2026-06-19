<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsCategoryResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $translation = $this->getTranslation($this->resource, $locale);

        return [
            'id' => $this->id,
            'name' => $translation?->name,
            'slug' => $translation?->slug,
            'description' => $translation?->description,
            'article_count' => $this->whenLoaded('news', function () {
                return $this->news->count();
            }),
        ];
    }
}