<?php

namespace App\Http\Controllers;

use App\Models\QuickLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class QuickLinkController extends Controller
{
    public function index()
    {
        $links = QuickLink::orderBy('sort_order')->orderBy('id', 'desc')->get();
        return Inertia::render('Theme/QuickLinks/Index', [
            'quickLinks' => $links
        ]);
    }

    public function create()
    {
        return Inertia::render('Theme/QuickLinks/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean'
        ]);

        $data = [
            'title' => $validated['title'],
            'button_text' => $validated['button_text'] ?? null,
            'url' => $validated['url'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ];

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('quick-links', 'public');
        }

        $data['sort_order'] = QuickLink::max('sort_order') + 1;

        QuickLink::create($data);

        return redirect()->route('quick-links.index')->with('success', 'Quick link created successfully.');
    }

    public function edit(QuickLink $quickLink)
    {
        return Inertia::render('Theme/QuickLinks/Edit', [
            'quickLink' => $quickLink
        ]);
    }

    public function update(Request $request, QuickLink $quickLink)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean'
        ]);

        $data = [
            'title' => $validated['title'],
            'button_text' => $validated['button_text'] ?? null,
            'url' => $validated['url'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ];

        if ($request->hasFile('image')) {
            // Delete old image
            if ($quickLink->image_path) {
                Storage::disk('public')->delete($quickLink->image_path);
            }
            $data['image_path'] = $request->file('image')->store('quick-links', 'public');
        }

        $quickLink->update($data);

        return redirect()->route('quick-links.index')->with('success', 'Quick link updated successfully.');
    }

    public function destroy(QuickLink $quickLink)
    {
        if ($quickLink->image_path) {
            Storage::disk('public')->delete($quickLink->image_path);
        }
        
        $quickLink->delete();

        return redirect()->route('quick-links.index')->with('success', 'Quick link deleted successfully.');
    }

    public function toggleActive(QuickLink $quickLink)
    {
        $quickLink->update(['is_active' => !$quickLink->is_active]);
        return back()->with('success', 'Quick link status updated.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:quick_links,id',
            'items.*.sort_order' => 'required|integer'
        ]);

        foreach ($validated['items'] as $item) {
            QuickLink::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return redirect()->back();
    }
}
