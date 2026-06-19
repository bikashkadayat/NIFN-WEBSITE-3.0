<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\DeveloperChangelogResource;
use App\Http\Resources\Api\V1\DeveloperSdkResource;
use App\Models\Content;
use App\Models\DeveloperChangelog;
use App\Models\DeveloperPage;
use App\Models\DeveloperRegistration;
use App\Models\DeveloperSdk;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeveloperPortalController extends Controller
{
    private static array $CATEGORY_MAP = [
        'dev-home'               => 'Getting Started',
        'dev-quick-start'        => 'Getting Started',
        'dev-sandbox'            => 'Getting Started',
        'dev-sandbox-setup'      => 'Getting Started',
        'dev-authentication'     => 'API Reference',
        'dev-open-payments'      => 'API Reference',
        'dev-error-codes'        => 'API Reference',
        'dev-webhooks'           => 'API Reference',
        'dev-sdks'               => 'SDKs & Libraries',
        'dev-guide-cooperatives' => 'Integration Guides',
        'dev-guide-fintechs'     => 'Integration Guides',
        'dev-guide-merchants'    => 'Integration Guides',
        'dev-rafiki'             => 'Advanced',
        'dev-architecture'       => 'Advanced',
    ];

    private static array $SORT_ORDER = [
        'Getting Started'    => 1,
        'API Reference'      => 2,
        'SDKs & Libraries'   => 3,
        'Integration Guides' => 4,
        'Advanced'           => 5,
    ];

    public function navigation(Request $request): JsonResponse
    {
        $locale = $request->query('locale', 'en');

        // Try DeveloperPage model first; fall back to Content model
        $useDeveloperPages = DeveloperPage::where('is_published', true)->exists();

        if ($useDeveloperPages) {
            $pages = DeveloperPage::with(['translations', 'children.translations'])
                ->where('is_published', true)
                ->whereNull('parent_id')
                ->orderBy('sort_order')
                ->get();

            $tree = $pages->map(fn ($page) => $this->buildNavNodeFromDevPage($page, $locale))->values();
            return response()->json(['data' => $tree]);
        }

        // Fall back: build navigation from Content model.
        // Prefer non-dev-prefixed slugs (they have content); skip duplicates.
        $contents = Content::with(['translations'])
            ->where('portal_type', 'developer')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        // Deduplicate: if both 'foo' and 'dev-foo' exist, prefer 'foo' (has body).
        // Build a map from canonical name → best Content item.
        $seen = [];
        $deduped = [];
        foreach ($contents as $content) {
            $slug = $content->slug;
            $canonical = str_starts_with($slug, 'dev-') ? substr($slug, 4) : $slug;
            $translation = $content->translations->firstWhere('locale', 'en') ?? $content->translations->first();
            $hasBody = !empty($translation?->body);

            if (!isset($seen[$canonical]) || ($hasBody && !$seen[$canonical]['hasBody'])) {
                $seen[$canonical] = ['hasBody' => $hasBody, 'slug' => $slug];
                $deduped[$canonical] = $content;
            }
        }

        $nodes = collect(array_values($deduped))->map(function (Content $content) use ($locale) {
            $translation = $content->translations->firstWhere('locale', $locale)
                ?? $content->translations->firstWhere('locale', 'en')
                ?? $content->translations->first();

            $slug = $content->slug;
            $devKey = str_starts_with($slug, 'dev-') ? $slug : 'dev-' . $slug;
            $category = self::$CATEGORY_MAP[$devKey] ?? self::$CATEGORY_MAP[$slug] ?? 'Documentation';

            return [
                'id'       => $content->id,
                'title'    => $translation?->title ?? ucwords(str_replace(['-', '_'], ' ', $slug)),
                'slug'     => $slug,
                'icon'     => null,
                'category' => $category,
                'children' => [],
            ];
        })->sortBy(fn ($node) => (self::$SORT_ORDER[$node['category']] ?? 99) . '_' . $node['slug'])
          ->values();

        return response()->json(['data' => $nodes]);
    }

    private function buildNavNodeFromDevPage(DeveloperPage $page, string $locale): array
    {
        $translation = $page->translations->firstWhere('locale', $locale)
            ?? $page->translations->firstWhere('locale', 'en')
            ?? $page->translations->first();

        return [
            'id'       => $page->id,
            'title'    => $translation?->title,
            'slug'     => $translation?->slug ?? $page->id,
            'icon'     => $page->icon,
            'category' => $page->category,
            'children' => $page->children->map(fn ($child) => $this->buildNavNodeFromDevPage($child, $locale))->values(),
        ];
    }

    public function pages(Request $request): JsonResponse
    {
        $useDeveloperPages = DeveloperPage::where('is_published', true)->exists();

        if ($useDeveloperPages) {
            $pages = DeveloperPage::with(['translations'])
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get();
            return response()->json(['data' => $pages]);
        }

        $contents = Content::with(['translations'])
            ->where('portal_type', 'developer')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        $locale = $request->query('locale', 'en');
        $data = $contents->map(fn ($c) => $this->contentToDevPage($c, $locale));

        return response()->json(['data' => $data]);
    }

    public function page(Request $request, string $slug): JsonResponse
    {
        $useDeveloperPages = DeveloperPage::where('is_published', true)->exists();

        if ($useDeveloperPages) {
            $page = DeveloperPage::with(['translations'])
                ->where('is_published', true)
                ->whereHas('translations', fn ($q) => $q->where('slug', $slug))
                ->firstOrFail();
            return response()->json(['data' => $page]);
        }

        $locale = $request->query('locale', 'en');

        // Collect all content matching exact slug OR dev-prefixed/unprefixed variants
        $candidates = Content::with(['translations'])
            ->where('portal_type', 'developer')
            ->where('is_published', true)
            ->where(function ($q) use ($slug) {
                $base = str_starts_with($slug, 'dev-') ? substr($slug, 4) : $slug;
                $q->where('slug', $slug)
                  ->orWhere('slug', 'dev-' . $base)
                  ->orWhere('slug', $base);
            })
            ->get();

        if ($candidates->isEmpty()) {
            return response()->json(['message' => 'Page not found.'], 404);
        }

        // Prefer the candidate that has body content
        $content = $candidates->first(fn ($c) => !empty($c->translations->firstWhere('locale', 'en')?->body))
            ?? $candidates->first();

        return response()->json(['data' => $this->contentToDevPage($content, $locale)]);
    }

    private function contentToDevPage(Content $content, string $locale = 'en'): array
    {
        $translation = $content->translations->firstWhere('locale', $locale)
            ?? $content->translations->firstWhere('locale', 'en')
            ?? $content->translations->first();

        $slug = $content->slug;

        return [
            'id'              => $content->id,
            'title'           => $translation?->title ?? '',
            'slug'            => $slug,
            'body'            => $translation?->body ?? '',
            'excerpt'         => $translation?->excerpt ?? '',
            'category'        => self::$CATEGORY_MAP[$slug] ?? 'Documentation',
            'icon'            => null,
            'parent_id'       => null,
            'sort_order'      => $content->sort_order ?? 0,
            'seo_title'       => $translation?->seo_title ?? '',
            'seo_description' => $translation?->seo_description ?? '',
            'updated_at'      => $content->updated_at,
        ];
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

        $data = $settings->mapWithKeys(fn ($s) => [$s->key => $s->value])->toArray();

        return response()->json($data);
    }

    public function register(Request $request): JsonResponse
    {
        // Accept both frontend field names and DB column names
        $request->merge([
            'name'             => $request->input('name') ?? $request->input('contact_name'),
            'organization'     => $request->input('organization') ?? $request->input('organization_name'),
            'institution_type' => $request->input('institution_type') ?? $request->input('organization_type'),
            'message'          => $request->input('message') ?? $request->input('use_case'),
        ]);

        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255'],
            'organization'     => ['nullable', 'string', 'max:255'],
            'institution_type' => ['required', 'string', 'max:100'],
            'message'          => ['nullable', 'string'],
            'terms_accepted'   => ['sometimes', 'boolean'],
            'agreed_terms'     => ['sometimes', 'boolean'],
        ]);

        unset($validated['terms_accepted'], $validated['agreed_terms']);

        DeveloperRegistration::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Registration submitted successfully. We will review your application and get in touch.',
        ]);
    }
}
