<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\RevalidationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $settings = Setting::orderBy('group')->orderBy('key')->get();

        return response()->json(['data' => $settings]);
    }

    public function batchUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'settings'       => ['required', 'array'],
            'settings.*.key' => ['required', 'string'],
            'settings.*.value' => ['nullable'],
            'settings.*.group' => ['nullable', 'string'],
        ]);

        foreach ($request->settings as $item) {
            Setting::updateOrCreate(
                ['key' => $item['key']],
                [
                    'value' => $item['value'] ?? null,
                    'group' => $item['group'] ?? 'general',
                ]
            );
        }

        RevalidationService::trigger('all', 'all');

        return response()->json(['message' => 'Settings updated.']);
    }

    public function update(Request $request, string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        $setting->update(['value' => $request->value]);

        RevalidationService::trigger('all', 'all');

        return response()->json(['data' => $setting, 'message' => 'Setting updated.']);
    }
}
