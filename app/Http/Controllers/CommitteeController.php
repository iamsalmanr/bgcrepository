<?php

namespace App\Http\Controllers;

use App\Models\Committee;
use App\Models\CommitteeMember;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CommitteeController extends Controller
{
    /**
     * Display a listing of the committees (for AJAX / API).
     */
    public function index()
    {
        $committees = Committee::withCount('members')
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'committees' => $committees
        ]);
    }

    /**
     * Store a newly created committee in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:committees,name',
            'show_in_navbar' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $name = trim($validated['name']);
        
        // Generate clean slug, turning & into and
        $slugBase = str_replace('&', 'and', $name);
        $slug = Str::slug($slugBase);
        
        // Ensure uniqueness for slug
        $originalSlug = $slug;
        $counter = 1;
        while (Committee::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $sortOrder = $validated['sort_order'] ?? null;
        if ($sortOrder === null) {
            $maxOrder = Committee::max('sort_order') ?? 0;
            $sortOrder = $maxOrder + 1;
        }

        $showInNavbar = $request->has('show_in_navbar') ? $request->boolean('show_in_navbar') : true;

        $committee = Committee::create([
            'name' => $name,
            'slug' => $slug,
            'sort_order' => $sortOrder,
            'show_in_navbar' => $showInNavbar,
            'is_active' => true,
        ]);

        Committee::syncNavbarMenus();

        return redirect()->back()->with('success', "Committee '{$committee->name}' created successfully.");
    }

    /**
     * Update the specified committee in storage.
     */
    public function update(Request $request, Committee $committee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:committees,name,' . $committee->id,
            'show_in_navbar' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $oldName = $committee->name;
        $newName = trim($validated['name']);

        // Update member references if name changed
        if ($oldName !== $newName) {
            CommitteeMember::where('committee', $oldName)->update(['committee' => $newName]);
        }

        $slugBase = str_replace('&', 'and', $newName);
        $slug = Str::slug($slugBase);
        
        $existingWithSlug = Committee::where('slug', $slug)->where('id', '!=', $committee->id)->first();
        if ($existingWithSlug) {
            $slug = "{$slug}-{$committee->id}";
        }

        $committee->name = $newName;
        $committee->slug = $slug;

        if ($request->has('show_in_navbar')) {
            $committee->show_in_navbar = $request->boolean('show_in_navbar');
        }

        if (isset($validated['sort_order'])) {
            $committee->sort_order = $validated['sort_order'];
        }

        $committee->save();

        Committee::syncNavbarMenus();

        return redirect()->back()->with('success', "Committee '{$committee->name}' updated successfully.");
    }

    /**
     * Remove the specified committee from storage.
     */
    public function destroy(Request $request, Committee $committee)
    {
        $committeeName = $committee->name;

        // Optionally delete or keep members
        if ($request->boolean('delete_members')) {
            CommitteeMember::where('committee', $committeeName)->delete();
        }

        $committee->delete();

        Committee::syncNavbarMenus();

        return redirect()->back()->with('success', "Committee '{$committeeName}' removed successfully.");
    }

    /**
     * Toggle the navbar visibility for a committee.
     */
    public function toggleNavbar(Committee $committee)
    {
        $committee->show_in_navbar = !$committee->show_in_navbar;
        $committee->save();

        Committee::syncNavbarMenus();

        $status = $committee->show_in_navbar ? 'enabled in navbar' : 'hidden from navbar';
        return redirect()->back()->with('success', "Committee '{$committee->name}' is now {$status}.");
    }

    /**
     * Reorder committees.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'committees' => 'required|array',
            'committees.*.id' => 'required|exists:committees,id',
            'committees.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->committees as $item) {
            Committee::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Committee::syncNavbarMenus();

        return redirect()->back()->with('success', 'Committees reordered successfully.');
    }
}
