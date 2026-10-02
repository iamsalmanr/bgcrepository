<?php

namespace App\Http\Controllers;

use App\Models\WinnerList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class WinnerListController extends Controller
{
    public function index()
    {
        $records = WinnerList::orderBy('id', 'desc')->paginate(20);
        return Inertia::render('Admin/Tournaments/Winners/Index', [
            'records' => $records
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tournaments/Winners/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'nullable|date',
            'file' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:10240',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('winner_lists', 'public');
        }

        WinnerList::create([
            'title' => $validated['title'],
            'date' => $validated['date'] ?? null,
            'file_path' => $filePath,
        ]);

        return redirect()->route('winner-lists.index')->with('success', 'Winner list created successfully.');
    }

    public function edit(WinnerList $winnerList)
    {
        return Inertia::render('Admin/Tournaments/Winners/Edit', [
            'record' => $winnerList
        ]);
    }

    public function update(Request $request, WinnerList $winnerList)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'nullable|date',
            'file' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:10240',
        ]);

        $winnerList->title = $validated['title'];
        $winnerList->date = $validated['date'] ?? null;

        if ($request->hasFile('file')) {
            if ($winnerList->file_path && Storage::disk('public')->exists($winnerList->file_path)) {
                Storage::disk('public')->delete($winnerList->file_path);
            }
            $winnerList->file_path = $request->file('file')->store('winner_lists', 'public');
        }

        $winnerList->save();

        return redirect()->route('winner-lists.index')->with('success', 'Winner list updated successfully.');
    }

    public function destroy(WinnerList $winnerList)
    {
        if ($winnerList->file_path && Storage::disk('public')->exists($winnerList->file_path)) {
            Storage::disk('public')->delete($winnerList->file_path);
        }
        
        $winnerList->delete();
        return redirect()->route('winner-lists.index')->with('success', 'Winner list deleted successfully.');
    }
}
