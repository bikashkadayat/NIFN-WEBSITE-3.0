<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ContentResource;
use App\Models\Content;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function index(Request $request)
    {
        $query = Content::with(['translations', 'featuredImage'])
            ->published()
            ->orderBy('sort_order');

        if ($request->has('portal_type')) {
            $query->where('portal_type', $request->portal_type);
        }

        return ContentResource::collection($query->get());
    }

    public function show(Request $request, string $slug)
    {
        $content = Content::with(['translations', 'featuredImage'])
            ->published()
            ->whereHas('translations', fn($q) => $q->where('slug', $slug))
            ->first();

        if (!$content) {
            // Also try direct slug column
            $content = Content::with(['translations', 'featuredImage'])
                ->published()
                ->where('slug', $slug)
                ->first();
        }

        if (!$content) {
            return response()->json(['success' => false, 'message' => 'Content not found.'], 404);
        }

        return new ContentResource($content);
    }

    public function byPortalType(Request $request, string $portalType)
    {
        $contents = Content::with(['translations', 'featuredImage'])
            ->published()
            ->where('portal_type', $portalType)
            ->orderBy('sort_order')
            ->get();

        return ContentResource::collection($contents);
    }
}
