<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $translation = $this->getTranslation($this->resource, $locale);

        return [
            'id' => $this->id,
            'title' => $translation?->title,
            'subtitle' => $translation?->subtitle,
            'image_url' => $this->image?->url,
            'primary_button_text' => $translation?->primary_button_text,
            'primary_button_link' => $translation?->primary_button_link ?? $this->primary_button_link,
            'secondary_button_text' => $translation?->secondary_button_text,
            'secondary_button_link' => $translation?->secondary_button_link ?? $this->secondary_button_link,
            'text_alignment' => $this->text_alignment,
            'overlay_opacity' => $this->overlay_opacity,
            'sort_order' => $this->sort_order,
        ];
    }
}