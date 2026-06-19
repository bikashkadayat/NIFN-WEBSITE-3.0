<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PopupNoticeResource;
use App\Models\PopupNotice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PopupNoticeController extends Controller
{
    public function active(Request $request): JsonResponse
    {
        $now = now();

        $notice = PopupNotice::with(['translations', 'image'])
            ->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->orderBy('created_at', 'desc')
            ->first();

        if (! $notice) {
            return response()->json(['data' => null]);
        }

        return response()->json(['data' => (new PopupNoticeResource($notice))->resolve($request)]);
    }
}
