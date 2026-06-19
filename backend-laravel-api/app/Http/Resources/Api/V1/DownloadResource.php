<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DownloadResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $translation = $this->getTranslation($this->resource, $locale);

        return [
            'id' => $this->id,
            'title' => $translation?->title,
            'description' => $translation?->description,
            'file_url' => $this->getFileUrlAttribute(),
            'file_name' => $this->file_name,
            'file_size' => $this->file_size,
            'file_type' => $this->file_type,
            'thumbnail_url' => $this->thumbnail?->url,
            'download_count' => $this->download_count,
            'category' => $this->whenLoaded('category', function () use ($locale) {
                if (! $this->category) {
                    return null;
                }
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->translation($locale)?->name,
                    'slug' => $this->category->translation($locale)?->slug,
                ];
            }),
        ];
    }
}