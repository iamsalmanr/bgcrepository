<?php

namespace App\Http\Controllers;

use App\Models\FlightSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class FlightScheduleController extends Controller
{
    public function index()
    {
        $records = FlightSchedule::orderBy('id', 'desc')->paginate(20);
        return Inertia::render('Admin/Tournaments/FlightSchedules/Index', [
            'records' => $records
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tournaments/FlightSchedules/Create');
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
            $filePath = $request->file('file')->store('flight_schedules', 'public');
        }

        FlightSchedule::create([
            'title' => $validated['title'],
            'date' => $validated['date'] ?? null,
            'file_path' => $filePath,
        ]);

        return redirect()->route('flight-schedules.index')->with('success', 'Flight schedule created successfully.');
    }

    public function edit(FlightSchedule $flightSchedule)
    {
        return Inertia::render('Admin/Tournaments/FlightSchedules/Edit', [
            'record' => $flightSchedule
        ]);
    }

    public function update(Request $request, FlightSchedule $flightSchedule)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'nullable|date',
            'file' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:10240',
        ]);

        $flightSchedule->title = $validated['title'];
        $flightSchedule->date = $validated['date'] ?? null;

        if ($request->hasFile('file')) {
            if ($flightSchedule->file_path && Storage::disk('public')->exists($flightSchedule->file_path)) {
                Storage::disk('public')->delete($flightSchedule->file_path);
            }
            $flightSchedule->file_path = $request->file('file')->store('flight_schedules', 'public');
        }

        $flightSchedule->save();

        return redirect()->route('flight-schedules.index')->with('success', 'Flight schedule updated successfully.');
    }

    public function destroy(FlightSchedule $flightSchedule)
    {
        if ($flightSchedule->file_path && Storage::disk('public')->exists($flightSchedule->file_path)) {
            Storage::disk('public')->delete($flightSchedule->file_path);
        }
        
        $flightSchedule->delete();
        return redirect()->route('flight-schedules.index')->with('success', 'Flight schedule deleted successfully.');
    }
}
