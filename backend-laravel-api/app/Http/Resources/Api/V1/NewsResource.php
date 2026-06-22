<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $translation = $this->getTranslation($this->resource, $locale);
        $isDetail = $request->routeIs('api.news.show');

        $data = [
            'id' => $this->id,
            'title' => $translation?->title,
            'slug' => $translation?->slug,
            'excerpt' => $translation?->excerpt,
            'featured_image_url' => $this->featuredImage?->url,
            'is_featured' => $this->is_featured,
            'is_breaking' => $this->is_breaking,
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
            'tags' => $this->whenLoaded('tags', function () use ($locale) {
                return $this->tags->map(function ($tag) use ($locale) {
                    return [
                        'id' => $tag->id,
                        'name' => $tag->translation($locale)?->name,
                        'slug' => $tag->translation($locale)?->slug,
                    ];
                })->values();
            }),
            'author' => $this->whenLoaded('author', function () {
                return [
                    'id' => $this->author->id,
                    'name' => $this->author->name,
                ];
            }),
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];

        if ($isDetail) {
            $data['body']             = $translation?->body;
            $data['seo_title']        = $translation?->seo_title;
            $data['seo_description']  = $translation?->seo_description;
            $data['seo_keywords']     = $translation?->seo_keywords;
        }

        return $data;
    }
}