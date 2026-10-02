<?php

namespace App\Http\Controllers;

use App\Models\TournamentResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TournamentResultController extends Controller
{
    public function index()
    {
        $records = TournamentResult::orderBy('id', 'desc')->paginate(20);
        return Inertia::render('Admin/Tournaments/Results/Index', [
            'records' => $records
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tournaments/Results/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sponsored_by' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'file' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:10240',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('tournament_results', 'public');
        }

        TournamentResult::create([
            'name' => $validated['name'],
            'sponsored_by' => $validated['sponsored_by'] ?? null,
            'date' => $validated['date'] ?? null,
            'file_path' => $filePath,
        ]);

        return redirect()->route('tournament-results.index')->with('success', 'Result created successfully.');
    }

    public function edit(TournamentResult $tournamentResult)
    {
        return Inertia::render('Admin/Tournaments/Results/Edit', [
            'result' => $tournamentResult
        ]);
    }

    public function update(Request $request, TournamentResult $tournamentResult)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sponsored_by' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'file' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:10240',
        ]);

        $tournamentResult->name = $validated['name'];
        $tournamentResult->sponsored_by = $validated['sponsored_by'] ?? null;
        $tournamentResult->date = $validated['date'] ?? null;

        if ($request->hasFile('file')) {
            if ($tournamentResult->file_path && Storage::disk('public')->exists($tournamentResult->file_path)) {
                Storage::disk('public')->delete($tournamentResult->file_path);
            }
            $tournamentResult->file_path = $request->file('file')->store('tournament_results', 'public');
        }

        $tournamentResult->save();

        return redirect()->route('tournament-results.index')->with('success', 'Result updated successfully.');
    }

    public function destroy(TournamentResult $tournamentResult)
    {
        if ($tournamentResult->file_path && Storage::disk('public')->exists($tournamentResult->file_path)) {
            Storage::disk('public')->delete($tournamentResult->file_path);
        }
        
        $tournamentResult->delete();
        return redirect()->route('tournament-results.index')->with('success', 'Result deleted successfully.');
    }
}
