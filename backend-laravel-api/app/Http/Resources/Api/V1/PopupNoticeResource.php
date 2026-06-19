<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PopupNoticeResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $translation = $this->getTranslation($this->resource, $locale);

        return [
            'id' => $this->id,
            'title' => $translation?->title,
            'body' => $translation?->body,
            'image_url' => $this->image?->url,
            'button_text' => $translation?->button_text,
            'button_link' => $translation?->button_link ?? $this->button_link,
            'type' => $this->type,
            'display_frequency' => $this->display_frequency,
            'start_date' => $this->start_date?->toISOString(),
            'end_date' => $this->end_date?->toISOString(),
        ];
    }
}