<?php

namespace App\Http\Controllers;

use App\Models\HoleInOne;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HoleInOneController extends Controller
{
    public function index()
    {
        $records = HoleInOne::orderBy('id', 'desc')->paginate(20);
        return Inertia::render('Admin/Tournaments/HoleInOnes/Index', [
            'records' => $records
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tournaments/HoleInOnes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hole_no' => 'required|string|max:255',
            'date' => 'nullable|date',
        ]);

        HoleInOne::create($validated);

        return redirect()->route('hole-in-ones.index')->with('success', 'Record created successfully.');
    }

    public function edit(HoleInOne $holeInOne)
    {
        return Inertia::render('Admin/Tournaments/HoleInOnes/Edit', [
            'record' => $holeInOne
        ]);
    }

    public function update(Request $request, HoleInOne $holeInOne)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hole_no' => 'required|string|max:255',
            'date' => 'nullable|date',
        ]);

        $holeInOne->update($validated);

        return redirect()->route('hole-in-ones.index')->with('success', 'Record updated successfully.');
    }

    public function destroy(HoleInOne $holeInOne)
    {
        $holeInOne->delete();
        return redirect()->route('hole-in-ones.index')->with('success', 'Record deleted successfully.');
    }
}
