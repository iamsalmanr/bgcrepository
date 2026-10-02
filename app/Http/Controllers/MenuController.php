<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::withCount('items')->get();
        return Inertia::render('Menus/Index', [
            'menus' => $menus
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|unique:menus,location',
        ]);

        Menu::create($validated);
        return redirect()->back()->with('success', 'Menu created successfully.');
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();
        return redirect()->back()->with('success', 'Menu deleted successfully.');
    }

    public function builder(Menu $menu)
    {
        $menu->load('items'); // This loads nested children due to the $with in MenuItem model
        return Inertia::render('Menus/Builder', [
            'menu' => $menu,
            'locations' => ['top_bar', 'footer', 'mobile_hamburger']
        ]);
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|unique:menus,location,' . $menu->id,
        ]);
        
        $menu->update($validated);
        return redirect()->back()->with('success', 'Menu updated successfully.');
    }

    public function saveItems(Request $request, Menu $menu)
    {
        $items = $request->input('items', []);

        DB::transaction(function () use ($menu, $items) {
            // Delete existing items
            $menu->items()->delete();

            // Re-insert recursively
            $this->insertItems($menu->id, null, $items);
        });

        return redirect()->back()->with('success', 'Menu structure saved successfully.');
    }

    private function insertItems($menuId, $parentId, $items)
    {
        foreach ($items as $index => $item) {
            $created = MenuItem::create([
                'menu_id' => $menuId,
                'parent_id' => $parentId,
                'title' => $item['title'],
                'url' => $item['url'] ?? null,
                'target' => $item['target'] ?? '_self',
                'order' => $index,
            ]);

            if (!empty($item['children'])) {
                $this->insertItems($menuId, $created->id, $item['children']);
            }
        }
    }
}
