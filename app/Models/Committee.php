<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Committee extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'sort_order',
        'show_in_navbar',
        'is_active',
    ];

    protected $casts = [
        'show_in_navbar' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function members()
    {
        return $this->hasMany(CommitteeMember::class, 'committee', 'name')
                    ->orderBy('sort_order')
                    ->orderBy('id', 'asc');
    }

    /**
     * Automatically synchronize the public navbar menu items under "About Us"
     * across all active navigation menus (top_bar, mobile_hamburger).
     */
    public static function syncNavbarMenus()
    {
        $activeCommittees = static::where('is_active', true)
            ->where('show_in_navbar', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        $menus = Menu::whereIn('location', ['top_bar', 'mobile_hamburger'])->get();
        if ($menus->isEmpty()) {
            $menus = Menu::all();
        }

        foreach ($menus as $menu) {
            // Find "About Us" parent item in this menu
            $aboutUsItem = MenuItem::where('menu_id', $menu->id)
                ->whereNull('parent_id')
                ->where(function ($q) {
                    $q->where('title', 'LIKE', '%About%')
                      ->orWhere('title', 'LIKE', '%about%');
                })
                ->first();

            if (!$aboutUsItem) {
                continue;
            }

            // Get existing children
            $existingChildren = MenuItem::where('parent_id', $aboutUsItem->id)->get();

            // Identify gallery item or non-committee items
            $galleryItem = $existingChildren->first(function ($item) {
                return Str::contains(strtolower($item->url ?? ''), ['gallery', 'photo']) ||
                       Str::contains(strtolower($item->title ?? ''), ['gallery']);
            });

            // Delete existing committee menu items under "About Us"
            foreach ($existingChildren as $child) {
                // If it's not the gallery item, delete it so we can re-insert in current sort order
                if (!$galleryItem || $child->id !== $galleryItem->id) {
                    $child->delete();
                }
            }

            $orderIndex = 1;
            if ($galleryItem) {
                $galleryItem->update(['order' => $orderIndex++]);
            }

            // Re-insert enabled committees in correct sort order
            foreach ($activeCommittees as $committee) {
                MenuItem::create([
                    'menu_id' => $menu->id,
                    'parent_id' => $aboutUsItem->id,
                    'title' => $committee->name,
                    'url' => '/' . $committee->slug,
                    'target' => '_self',
                    'order' => $orderIndex++,
                ]);
            }
        }
    }
}
