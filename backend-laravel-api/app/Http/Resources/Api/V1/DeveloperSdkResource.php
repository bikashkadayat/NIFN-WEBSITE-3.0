<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\V1\Concerns\HandlesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeveloperSdkResource extends JsonResource
{
    use HandlesLocale;

    public function toArray(Request $request): array
    {
        $locale = $this->getLocale($request);
        $translation = $this->getTranslation($this->resource, $locale);

        return [
            'id' => $this->id,
            'language' => $this->language,
            'package_name' => $this->package_name,
            'status' => $this->status,
            'maintainer' => $this->maintainer,
            'license' => $this->license,
            'runtime' => $this->runtime,
            'documentation_url' => $this->documentation_url,
            'github_url' => $this->github_url,
            'title' => $translation?->title,
            'description' => $translation?->description,
            'installation_code' => $translation?->installation_code,
            'usage_code' => $translation?->usage_code,
            'sort_order' => $this->sort_order,
            'is_published' => $this->is_published,
        ];
    }
}