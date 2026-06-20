<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\PopupNotice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PopupNoticeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notices = PopupNotice::with(['translations', 'image'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 20));

        return response()->json($notices);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image_id'          => ['nullable', 'uuid', 'exists:media,id'],
            'type'              => ['nullable', 'in:info,warning,success,promotional'],
            'start_date'        => ['nullable', 'date'],
            'end_date'          => ['nullable', 'date', 'after_or_equal:start_date'],
            'display_frequency' => ['nullable', 'in:always,once_session,once_day'],
            'button_link'       => ['nullable', 'string', 'max:500'],
            'is_active'         => ['boolean'],
            'translations'      => ['required', 'array'],
            'translations.*.locale'       => ['required', 'string', 'size:2'],
            'translations.*.title'        => ['nullable', 'string', 'max:255'],
            'translations.*.body'         => ['nullable', 'string'],
            'translations.*.button_text'  => ['nullable', 'string', 'max:100'],
            'translations.*.button_link'  => ['nullable', 'string', 'max:500'],
        ]);

        $enTitle = collect($request->translations)->firstWhere('locale', 'en')['title'] ?? '';
        if (empty(trim((string) $enTitle))) {
            return response()->json(['message' => 'English title is required.'], 422);
        }

        $notice = DB::transaction(function () use ($request) {
            $notice = PopupNotice::create([
                'image_id'          => $request->image_id,
                'type'              => $request->type ?? 'info',
                'start_date'        => $request->start_date,
                'end_date'          => $request->end_date,
                'display_frequency' => $request->display_frequency ?? 'once_session',
                'button_link'       => $request->button_link,
                'is_active'         => $request->boolean('is_active', false),
            ]);

            foreach ($request->translations as $trans) {
                if (empty(trim($trans['title'] ?? ''))) continue;
                $notice->translations()->create([
                    'locale'      => $trans['locale'],
                    'title'       => $trans['title'],
                    'body'        => $trans['body'] ?? null,
                    'button_text' => $trans['button_text'] ?? null,
                    'button_link' => $trans['button_link'] ?? null,
                ]);
            }

            return $notice;
        });

        return response()->json([
            'data'    => $notice->load('translations'),
            'message' => 'Popup notice created.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $notice = PopupNotice::with(['translations', 'image'])->findOrFail($id);

        return response()->json(['data' => $notice]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $notice = PopupNotice::findOrFail($id);

        DB::transaction(function () use ($request, $notice) {
            $notice->update(array_filter([
                'image_id'          => $request->image_id ?? $notice->image_id,
                'type'              => $request->type ?? $notice->type,
                'start_date'        => $request->start_date ?? $notice->start_date,
                'end_date'          => $request->end_date ?? $notice->end_date,
                'display_frequency' => $request->display_frequency ?? $notice->display_frequency,
                'button_link'       => $request->button_link ?? $notice->button_link,
                'is_active'         => $request->has('is_active') ? $request->boolean('is_active') : $notice->is_active,
            ], fn ($v) => $v !== null));

            foreach ($request->translations ?? [] as $trans) {
                if (empty(trim($trans['title'] ?? ''))) continue;
                $notice->translations()->updateOrCreate(
                    ['locale' => $trans['locale']],
                    [
                        'title'       => $trans['title'],
                        'body'        => $trans['body'] ?? null,
                        'button_text' => $trans['button_text'] ?? null,
                        'button_link' => $trans['button_link'] ?? null,
                    ]
                );
            }
        });

        return response()->json([
            'data'    => $notice->fresh('translations'),
            'message' => 'Popup notice updated.',
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        PopupNotice::findOrFail($id)->delete();

        return response()->json(['message' => 'Popup notice deleted.']);
    }
}
