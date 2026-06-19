<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MenuItemController extends Controller
{
    public function index(string $menuId): JsonResponse
    {
        $items = MenuItem::with(['translations', 'children.translations'])
            ->where('menu_id', $menuId)
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $items]);
    }

    public function store(Request $request, string $menuId): JsonResponse
    {
        $request->validate([
            'parent_id'   => ['nullable', 'uuid', 'exists:menu_items,id'],
            'url'         => ['nullable', 'string', 'max:500'],
            'target'      => ['nullable', 'in:_self,_blank'],
            'icon'        => ['nullable', 'string', 'max:100'],
            'sort_order'  => ['nullable', 'integer', 'min:0'],
            'is_active'   => ['boolean'],
            'translations' => ['required', 'array'],
            'translations.*.locale' => ['required', 'string', 'size:2'],
            'translations.*.title'  => ['required', 'string', 'max:255'],
        ]);

        $item = DB::transaction(function () use ($request, $menuId) {
            $maxOrder = MenuItem::where('menu_id', $menuId)
                ->where('parent_id', $request->parent_id)
                ->max('sort_order') ?? 0;

            $item = MenuItem::create([
                'menu_id'    => $menuId,
                'parent_id'  => $request->parent_id,
                'url'        => $request->url,
                'target'     => $request->target ?? '_self',
                'icon'       => $request->icon,
                'sort_order' => $request->sort_order ?? ($maxOrder + 1),
                'is_active'  => $request->boolean('is_active', true),
            ]);

            foreach ($request->translations as $trans) {
                $item->translations()->create([
                    'locale' => $trans['locale'],
                    'title'  => $trans['title'],
                ]);
            }

            return $item;
        });

        return response()->json([
            'data'    => $item->load('translations'),
            'message' => 'Menu item created.',
        ], 201);
    }

    public function update(Request $request, string $menuId, string $id): JsonResponse
    {
        $item = MenuItem::where('menu_id', $menuId)->findOrFail($id);

        DB::transaction(function () use ($request, $item) {
            $item->update(array_filter([
                'parent_id'  => $request->parent_id ?? $item->parent_id,
                'url'        => $request->url ?? $item->url,
                'target'     => $request->target ?? $item->target,
                'icon'       => $request->icon ?? $item->icon,
                'sort_order' => $request->sort_order ?? $item->sort_order,
                'is_active'  => $request->has('is_active') ? $request->boolean('is_active') : $item->is_active,
            ], fn ($v) => $v !== null));

            foreach ($request->translations ?? [] as $trans) {
                $item->translations()->updateOrCreate(
                    ['locale' => $trans['locale']],
                    ['title' => $trans['title']]
                );
            }
        });

        return response()->json([
            'data'    => $item->fresh('translations'),
            'message' => 'Menu item updated.',
        ]);
    }

    public function reorder(Request $request, string $menuId): JsonResponse
    {
        $request->validate([
            'order'   => ['required', 'array'],
            'order.*' => ['required', 'uuid'],
        ]);

        foreach ($request->order as $i => $itemId) {
            MenuItem::where('id', $itemId)->where('menu_id', $menuId)->update(['sort_order' => $i + 1]);
        }

        return response()->json(['message' => 'Menu items reordered.']);
    }

    public function destroy(string $menuId, string $id): JsonResponse
    {
        MenuItem::where('menu_id', $menuId)->findOrFail($id)->delete();

        return response()->json(['message' => 'Menu item deleted.']);
    }
}
