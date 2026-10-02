<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TournamentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Tournaments/Index', [
            'tournaments' => Tournament::with(['registrations.user'])
                ->orderBy('sort_order')
                ->orderBy('start_date', 'desc')
                ->get(),
            'members' => \App\Models\User::where('is_active', true)
                ->select('id', 'name', 'email', 'member_id', 'rank_designation', 'phone')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:tournaments,id',
            'orders.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->orders as $item) {
            Tournament::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['status' => 'success']);
    }

    public function create()
    {
        return Inertia::render('Admin/Tournaments/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:upcoming,live,completed',
            'location' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'image_path' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image_path')) {
            $path = $request->file('image_path')->store('tournaments', 'public');
            $validated['image_path'] = $path;
        }

        Tournament::create($validated);

        return redirect()->route('tournaments.index')->with('message', 'Tournament created successfully.');
    }

    public function edit(Tournament $tournament)
    {
        return Inertia::render('Admin/Tournaments/Edit', [
            'tournament' => $tournament,
        ]);
    }

    public function update(Request $request, Tournament $tournament)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:upcoming,live,completed',
            'location' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'image_path' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image_path')) {
            if ($tournament->image_path) {
                Storage::disk('public')->delete($tournament->image_path);
            }
            $path = $request->file('image_path')->store('tournaments', 'public');
            $validated['image_path'] = $path;
        }

        $tournament->update($validated);

        return redirect()->route('tournaments.index')->with('message', 'Tournament updated successfully.');
    }

    public function destroy(Tournament $tournament)
    {
        if ($tournament->image_path) {
            Storage::disk('public')->delete($tournament->image_path);
        }
        $tournament->delete();

        return redirect()->route('tournaments.index')->with('message', 'Tournament deleted successfully.');
    }
}
