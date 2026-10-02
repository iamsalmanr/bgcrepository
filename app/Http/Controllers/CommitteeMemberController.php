<?php

namespace App\Http\Controllers;

use App\Models\Committee;
use App\Models\CommitteeMember;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CommitteeMemberController extends Controller
{
    public function index(Request $request)
    {
        $query = CommitteeMember::orderBy('committee')
                                ->orderBy('sort_order')
                                ->orderBy('id', 'desc');

        if ($request->has('committee') && $request->committee !== '' && $request->committee !== 'All') {
            $query->where('committee', $request->committee);
        }

        $members = $query->get();

        // Get rich committees list with member counts
        $committees = Committee::withCount('members')
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        // If committees table is empty or missing existing ones, auto-seed
        if ($committees->isEmpty()) {
            $distinct = CommitteeMember::select('committee')->distinct()->pluck('committee');
            foreach ($distinct as $idx => $cName) {
                if ($cName) {
                    Committee::firstOrCreate(
                        ['name' => $cName],
                        [
                            'slug' => Str::slug($cName),
                            'sort_order' => $idx + 1,
                            'show_in_navbar' => true,
                            'is_active' => true,
                        ]
                    );
                }
            }
            $committees = Committee::withCount('members')
                ->orderBy('sort_order', 'asc')
                ->orderBy('name', 'asc')
                ->get();
        }

        return Inertia::render('CommitteeMembers/Index', [
            'members' => $members,
            'committees' => $committees,
            'filters' => $request->only(['committee']),
        ]);
    }

    public function create()
    {
        $committees = Committee::orderBy('sort_order', 'asc')->orderBy('name', 'asc')->get();

        return Inertia::render('CommitteeMembers/Create', [
            'committees' => $committees,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'committee' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $committeeName = trim($validated['committee']);

        // Auto-register committee in committees table if not already present
        $committeeRecord = Committee::firstOrCreate(
            ['name' => $committeeName],
            [
                'slug' => Str::slug($committeeName),
                'sort_order' => (Committee::max('sort_order') ?? 0) + 1,
                'show_in_navbar' => true,
                'is_active' => true,
            ]
        );

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('committees', 'public');
        }

        CommitteeMember::create([
            'name' => $validated['name'],
            'committee' => $committeeName,
            'designation' => $validated['designation'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'image_path' => $imagePath,
        ]);

        return redirect()->route('committee-members.index')->with('success', 'Committee member created successfully.');
    }

    public function edit(CommitteeMember $committeeMember)
    {
        $committees = Committee::orderBy('sort_order', 'asc')->orderBy('name', 'asc')->get();

        return Inertia::render('CommitteeMembers/Edit', [
            'member' => $committeeMember,
            'committees' => $committees,
        ]);
    }

    public function update(Request $request, CommitteeMember $committeeMember)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'committee' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $committeeName = trim($validated['committee']);

        // Ensure committee exists in committees table
        Committee::firstOrCreate(
            ['name' => $committeeName],
            [
                'slug' => Str::slug($committeeName),
                'sort_order' => (Committee::max('sort_order') ?? 0) + 1,
                'show_in_navbar' => true,
                'is_active' => true,
            ]
        );

        $committeeMember->name = $validated['name'];
        $committeeMember->committee = $committeeName;
        $committeeMember->designation = $validated['designation'] ?? null;
        $committeeMember->sort_order = $validated['sort_order'] ?? 0;

        if ($request->boolean('remove_image')) {
            if ($committeeMember->image_path && Storage::disk('public')->exists($committeeMember->image_path)) {
                Storage::disk('public')->delete($committeeMember->image_path);
            }
            $committeeMember->image_path = null;
        } elseif ($request->hasFile('image')) {
            if ($committeeMember->image_path && Storage::disk('public')->exists($committeeMember->image_path)) {
                Storage::disk('public')->delete($committeeMember->image_path);
            }
            $committeeMember->image_path = $request->file('image')->store('committees', 'public');
        }

        if ($request->has('image_position')) {
            $committeeMember->image_position = $request->input('image_position');
        }
        if ($request->has('image_scale')) {
            $committeeMember->image_scale = $request->input('image_scale');
        }

        $committeeMember->save();

        return redirect()->route('committee-members.index')->with('success', 'Committee member updated successfully.');
    }

    public function updatePosition(Request $request, CommitteeMember $committeeMember)
    {
        $validated = $request->validate([
            'image_position' => 'required|string|max:50',
            'image_scale' => 'nullable|integer|min:20|max:500',
        ]);

        $committeeMember->update([
            'image_position' => $validated['image_position'],
            'image_scale' => $validated['image_scale'] ?? 100,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Member photo position and zoom saved successfully.',
                'member' => $committeeMember,
            ]);
        }

        return redirect()->back()->with('success', 'Member photo position and zoom updated successfully.');
    }

    public function destroy(CommitteeMember $committeeMember)
    {
        if ($committeeMember->image_path && Storage::disk('public')->exists($committeeMember->image_path)) {
            Storage::disk('public')->delete($committeeMember->image_path);
        }
        
        $committeeMember->delete();
        return redirect()->route('committee-members.index')->with('success', 'Committee member deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'members' => 'required|array',
            'members.*.id' => 'required|exists:committee_members,id',
            'members.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->members as $memberData) {
            CommitteeMember::where('id', $memberData['id'])->update(['sort_order' => $memberData['sort_order']]);
        }

        return redirect()->back()->with('success', 'Committee members reordered successfully.');
    }
}
