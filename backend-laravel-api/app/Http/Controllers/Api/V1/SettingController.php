<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\SettingResource;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function public(Request $request): JsonResponse
    {
        $settings = Setting::all();

        $data = $settings->mapWithKeys(function ($setting) {
            $value = $setting->value;

            if (is_string($value) && in_array(strtolower($value), ['true', 'false'])) {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            } elseif (is_numeric($value)) {
                $value = (float) $value === (int) $value ? (int) $value : (float) $value;
            }

            return [$setting->key => $value];
        })->toArray();

        return response()->json($data);
    }
}
