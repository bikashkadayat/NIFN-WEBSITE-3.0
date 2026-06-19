<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\MenuItemResource;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $menus = Menu::with(['items.translations', 'items.children.translations', 'items.children.children.translations'])
            ->whereIn('location', ['header', 'footer'])
            ->get();

        return $menus->map(function ($menu) {
            return [
                'location' => $menu->location,
                'items' => MenuItemResource::collection($menu->items),
            ];
        });
    }

    public function show(Request $request, string $location)
    {
        $menu = Menu::with(['items.translations', 'items.children.translations', 'items.children.children.translations'])
            ->where('location', $location)
            ->firstOrFail();

        return [
            'location' => $menu->location,
            'items' => MenuItemResource::collection($menu->items),
        ];
    }
}