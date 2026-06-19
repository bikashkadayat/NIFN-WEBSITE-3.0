<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\DeveloperPageResource;
use App\Http\Resources\Api\V1\DeveloperSdkResource;
use App\Http\Resources\Api\V1\DeveloperChangelogResource;
use App\Models\DeveloperPage;
use App\Models\DeveloperSdk;
use App\Models\DeveloperChangelog;
use Illuminate\Http\Request;

class DeveloperController extends Controller
{
    public function pages(Request $request)
    {
        $query = DeveloperPage::with(['translations'])
            ->where('is_published', true)
            ->orderBy('sort_order');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $pages = $query->get();

        return DeveloperPageResource::collection($pages);
    }

    public function page(Request $request, string $slug)
    {
        $page = DeveloperPage::with(['translations'])
            ->where('is_published', true)
            ->whereHas('translations', function ($q) use ($slug) {
                $q->where('slug', $slug);
            })
            ->firstOrFail();

        return new DeveloperPageResource($page);
    }

    public function sdks(Request $request)
    {
        $query = DeveloperSdk::with(['translations'])
            ->where('is_published', true)
            ->orderBy('sort_order');

        if ($request->has('language')) {
            $query->where('language', $request->language);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $sdks = $query->get();

        return DeveloperSdkResource::collection($sdks);
    }

    public function sdk(Request $request, string $id)
    {
        $sdk = DeveloperSdk::with(['translations'])
            ->where('is_published', true)
            ->findOrFail($id);

        return new DeveloperSdkResource($sdk);
    }

    public function changelog(Request $request)
    {
        $query = DeveloperChangelog::with(['translations'])
            ->where('is_published', true)
            ->orderBy('release_date', 'desc');

        $changelog = $query->get();

        return DeveloperChangelogResource::collection($changelog);
    }

    public function changelogEntry(Request $request, string $version)
    {
        $entry = DeveloperChangelog::with(['translations'])
            ->where('is_published', true)
            ->where('version', $version)
            ->firstOrFail();

        return new DeveloperChangelogResource($entry);
    }
}