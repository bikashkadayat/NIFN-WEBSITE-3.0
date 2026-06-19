<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SearchResultResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $model = $this->resource;

        if ($model instanceof \App\Models\News) {
            $translation = $model->translation($locale);
            return [
                'title' => $translation?->title,
                'slug' => $translation?->slug,
                'excerpt' => $translation?->excerpt,
                'type' => 'news',
                'url' => '/news/' . ($translation?->slug ?? ''),
                'image_url' => $model->featuredImage?->url,
            ];
        }

        if ($model instanceof \App\Models\Gallery) {
            $translation = $model->translation($locale);
            return [
                'title' => $translation?->title,
                'slug' => $translation?->slug,
                'excerpt' => $translation?->description,
                'type' => 'gallery',
                'url' => '/gallery/' . ($translation?->slug ?? ''),
                'image_url' => $model->coverImage?->url,
            ];
        }

        if ($model instanceof \App\Models\Content) {
            $translation = $model->translation($locale);
            return [
                'title' => $translation?->title,
                'slug' => $translation?->slug,
                'excerpt' => $translation?->excerpt,
                'type' => 'page',
                'url' => '/' . ($translation?->slug ?? ''),
                'image_url' => $model->featuredImage?->url,
            ];
        }

        if ($model instanceof \App\Models\DeveloperPage) {
            $translation = $model->translation($locale);
            return [
                'title' => $translation?->title,
                'slug' => $translation?->slug,
                'excerpt' => $translation?->excerpt,
                'type' => 'page',
                'url' => '/developer/' . ($translation?->slug ?? ''),
                'image_url' => null,
            ];
        }

        return [
            'title' => '',
            'slug' => '',
            'excerpt' => '',
            'type' => 'unknown',
            'url' => '',
            'image_url' => null,
        ];
    }
}