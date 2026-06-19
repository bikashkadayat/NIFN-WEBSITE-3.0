<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\BannerResource;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $banners = Banner::with(['translations', 'image'])
            ->active()
            ->orderBy('sort_order')
            ->get();

        return BannerResource::collection($banners);
    }

    public function show(Request $request, string $id)
    {
        $banner = Banner::with(['translations', 'image'])
            ->active()
            ->findOrFail($id);

        return new BannerResource($banner);
    }
}
