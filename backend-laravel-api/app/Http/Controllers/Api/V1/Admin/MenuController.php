<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MenuController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $menus = Menu::with(['items.translations', 'items.children.translations'])
            ->get();

        return response()->json(['data' => $menus]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'location' => ['required', 'string', 'in:header,footer', 'unique:menus,location'],
        ]);

        $menu = Menu::create(['location' => $request->location]);

        return response()->json([
            'data'    => $menu,
            'message' => 'Menu created.',
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $menu = Menu::with(['items.translations', 'items.children.translations'])->findOrFail($id);

        return response()->json(['data' => $menu]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $menu = Menu::findOrFail($id);
        $request->validate([
            'location' => ['required', 'string', 'in:header,footer', 'unique:menus,location,' . $id],
        ]);

        $menu->update(['location' => $request->location]);

        return response()->json(['data' => $menu, 'message' => 'Menu updated.']);
    }

    public function destroy(string $id): JsonResponse
    {
        Menu::findOrFail($id)->delete();

        return response()->json(['message' => 'Menu deleted.']);
    }
}
