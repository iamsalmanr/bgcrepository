<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Partner;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    public function index()
    {
        $partners = Partner::orderBy('sort_order')->get();
        return Inertia::render('Theme/Partners/Index', [
            'partners' => $partners,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|url|max:255',
            'logo_file' => 'nullable|image|max:5120',
            'is_active' => 'boolean',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo_file')) {
            $logoPath = $request->file('logo_file')->store('partners', 'public');
        }

        $maxOrder = Partner::max('sort_order') ?? 0;

        Partner::create([
            'name' => $request->name,
            'url' => $request->url,
            'logo_path' => $logoPath,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $maxOrder + 1,
        ]);

        return redirect()->back()->with('success', 'Partner added successfully.');
    }

    public function update(Request $request, Partner $partner)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|url|max:255',
            'logo_file' => 'nullable|image|max:5120',
            'is_active' => 'boolean',
        ]);

        $logoPath = $partner->logo_path;
        if ($request->hasFile('logo_file')) {
            if ($logoPath) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo_file')->store('partners', 'public');
        }

        $partner->update([
            'name' => $request->name,
            'url' => $request->url,
            'logo_path' => $logoPath,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->back()->with('success', 'Partner updated successfully.');
    }

    public function destroy(Partner $partner)
    {
        if ($partner->logo_path) {
            Storage::disk('public')->delete($partner->logo_path);
        }
        $partner->delete();

        return redirect()->back()->with('success', 'Partner deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:partners,id',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            Partner::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return redirect()->back()->with('success', 'Partners reordered successfully.');
    }
}
