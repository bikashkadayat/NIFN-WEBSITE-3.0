<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $translation = $this->getTranslation($this->resource, $locale);

        return [
            'id' => $this->id,
            'title' => $translation?->title,
            'url' => $this->url,
            'target' => $this->target,
            'icon' => $this->icon,
            'children' => $this->whenLoaded('children', function () use ($request) {
                return MenuItemResource::collection($this->children)->resolve($request);
            }),
        ];
    }
}