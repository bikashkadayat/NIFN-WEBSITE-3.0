<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\NewsCategoryResource;
use App\Models\NewsCategory;
use Illuminate\Http\Request;

class NewsCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = NewsCategory::with(['translations', 'news'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return NewsCategoryResource::collection($categories);
    }

    public function show(Request $request, string $slug)
    {
        $category = NewsCategory::with(['translations', 'news'])
            ->whereHas('translations', function ($q) use ($slug) {
                $q->where('slug', $slug);
            })
            ->firstOrFail();

        return new NewsCategoryResource($category);
    }
}