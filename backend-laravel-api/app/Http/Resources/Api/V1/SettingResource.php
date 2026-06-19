<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $settings = $this->resource instanceof \Illuminate\Database\Eloquent\Collection
            ? $this->resource
            : collect($this->resource);

        return $settings->mapWithKeys(function ($setting) {
            $key = $setting->key;
            $value = $setting->value;

            if (is_string($value) && in_array(strtolower($value), ['true', 'false'])) {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            } elseif (is_numeric($value)) {
                $value = (float) $value === (int) $value ? (int) $value : (float) $value;
            }

            return [$key => $value];
        })->toArray();
    }
}