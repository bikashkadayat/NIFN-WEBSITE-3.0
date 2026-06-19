<?php

namespace App\Http\Resources\Api\V1\Concerns;

use Illuminate\Http\Request;

trait HandlesLocale
{
    protected function getLocale(Request $request): string
    {
        return $request->query('locale', $request->header('Accept-Language', 'en'));
    }

    protected function getTranslation($model, string $locale = 'en'): ?object
    {
        if (! $model) {
            return null;
        }

        if (! $model->relationLoaded('translations')) {
            $model->load('translations');
        }

        return $model->translations
            ->firstWhere('locale', $locale)
            ?? $model->translations->first();
    }
}