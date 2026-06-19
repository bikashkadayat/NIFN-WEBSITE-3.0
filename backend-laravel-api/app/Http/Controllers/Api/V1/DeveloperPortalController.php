<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\DeveloperChangelogResource;
use App\Http\Resources\Api\V1\DeveloperPageResource;
use App\Http\Resources\Api\V1\DeveloperSdkResource;
use App\Models\DeveloperChangelog;
use App\Models\DeveloperPage;
use App\Models\DeveloperRegistration;
use App\Models\DeveloperSdk;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeveloperPortalController extends Controller
{
    public function navigation(Request $request): JsonResponse
    {
        $locale = $request->query('locale', 'en');

        $pages = DeveloperPage::with(['translations', 'children.translations'])
            ->where('is_published', true)
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        $tree = $pages->map(function ($page) use ($locale) {
            return $this->buildNavNode($page, $locale);
        })->values();

        return response()->json(['data' => $tree]);
    }

    private function buildNavNode(DeveloperPage $page, string $locale): array
    {
        $translation = $page->translation($locale);

        return [
            'id'       => $page->id,
            'title'    => $translation?->title,
            'slug'     => $translation?->slug,
            'icon'     => $page->icon,
            'category' => $page->category,
            'children' => $page->children->map(function ($child) use ($locale) {
                return $this->buildNavNode($child, $locale);
            })->values(),
        ];
    }

    public function pages(Request $request): JsonResponse
    {
        $pages = DeveloperPage::with(['translations'])
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => DeveloperPageResource::collection($pages)->resolve($request),
        ]);
    }

    public function page(Request $request, string $slug): JsonResponse
    {
        $page = DeveloperPage::with(['translations'])
            ->where('is_published', true)
            ->whereHas('translations', function ($q) use ($slug) {
                $q->where('slug', $slug);
            })
            ->firstOrFail();

        return response()->json([
            'data' => (new DeveloperPageResource($page))->resolve($request),
        ]);
    }

    public function sdks(Request $request): JsonResponse
    {
        $sdks = DeveloperSdk::with(['translations'])
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => DeveloperSdkResource::collection($sdks)->resolve($request),
        ]);
    }

    public function changelog(Request $request): JsonResponse
    {
        $entries = DeveloperChangelog::with(['translations'])
            ->where('is_published', true)
            ->orderBy('release_date', 'desc')
            ->get();

        return response()->json([
            'data' => DeveloperChangelogResource::collection($entries)->resolve($request),
        ]);
    }

    public function settings(Request $request): JsonResponse
    {
        $settings = Setting::where('group', 'developer')->get();

        $data = $settings->mapWithKeys(function ($setting) {
            return [$setting->key => $setting->value];
        })->toArray();

        return response()->json($data);
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255'],
            'organization'     => ['nullable', 'string', 'max:255'],
            'institution_type' => ['required', 'in:cooperative,bank,fintech,remittance,developer,other'],
            'message'          => ['nullable', 'string'],
        ]);

        DeveloperRegistration::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Registration submitted successfully. We will review your application and get in touch.',
        ]);
    }
}
