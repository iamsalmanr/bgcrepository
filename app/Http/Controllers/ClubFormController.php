<?php

namespace App\Http\Controllers;

use App\Models\ClubForm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ClubFormController extends Controller
{
    public function index()
    {
        $forms = ClubForm::orderBy('sort_order')->orderBy('id', 'desc')->paginate(50);
        return Inertia::render('Forms/Index', [
            'forms' => $forms
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:club_forms,id',
            'orders.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->orders as $item) {
            ClubForm::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['status' => 'success']);
    }

    public function create()
    {
        return Inertia::render('Forms/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_.-]/', '', $file->getClientOriginalName());
        $filePath = $file->storeAs('forms', $filename, 'public');

        ClubForm::create([
            'title' => $validated['title'],
            'file_path' => $filePath,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('forms.index')->with('success', 'Form created successfully.');
    }

    public function edit(ClubForm $form)
    {
        return Inertia::render('Forms/Edit', [
            'form' => $form
        ]);
    }

    public function update(Request $request, ClubForm $form)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $form->title = $validated['title'];
        $form->sort_order = $validated['sort_order'] ?? 0;
        $form->is_active = $request->boolean('is_active', true);

        if ($request->hasFile('file')) {
            if ($form->file_path && Storage::disk('public')->exists($form->file_path)) {
                Storage::disk('public')->delete($form->file_path);
            }
            $file = $request->file('file');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_.-]/', '', $file->getClientOriginalName());
            $form->file_path = $file->storeAs('forms', $filename, 'public');
        }

        $form->save();

        return redirect()->route('forms.index')->with('success', 'Form updated successfully.');
    }

    public function destroy(ClubForm $form)
    {
        if ($form->file_path && Storage::disk('public')->exists($form->file_path)) {
            Storage::disk('public')->delete($form->file_path);
        }
        
        $form->delete();
        return redirect()->route('forms.index')->with('success', 'Form deleted successfully.');
    }

    public function viewFile(ClubForm $form)
    {
        if (!$form->file_path || !Storage::disk('public')->exists($form->file_path)) {
            abort(404, 'Form document not found');
        }

        $filePath = Storage::disk('public')->path($form->file_path);
        $mimeType = Storage::disk('public')->mimeType($form->file_path) ?: 'application/pdf';

        return response()->file($filePath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . basename($form->file_path) . '"',
        ]);
    }
}
