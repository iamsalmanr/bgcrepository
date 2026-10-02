<?php

namespace App\Http\Controllers;

use App\Models\ContactDirectory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactDirectoryController extends Controller
{
    public function index()
    {
        $directories = ContactDirectory::orderBy('column')->orderBy('sort_order')->orderBy('id', 'desc')->get();
        return Inertia::render('ContactDirectory/Index', [
            'directories' => $directories
        ]);
    }

    public function create()
    {
        return Inertia::render('ContactDirectory/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'column' => 'required|string|in:left,middle',
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'sort_order' => 'nullable|integer',
        ]);

        ContactDirectory::create($validated);

        return redirect()->route('contact-directory.index')->with('success', 'Contact directory created successfully.');
    }

    public function edit(ContactDirectory $contactDirectory)
    {
        return Inertia::render('ContactDirectory/Edit', [
            'directory' => $contactDirectory
        ]);
    }

    public function update(Request $request, ContactDirectory $contactDirectory)
    {
        $validated = $request->validate([
            'column' => 'required|string|in:left,middle',
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'sort_order' => 'nullable|integer',
        ]);

        $contactDirectory->update($validated);

        return redirect()->route('contact-directory.index')->with('success', 'Contact directory updated successfully.');
    }

    public function destroy(ContactDirectory $contactDirectory)
    {
        $contactDirectory->delete();
        return redirect()->route('contact-directory.index')->with('success', 'Contact directory deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:contact_directories,id',
            'items.*.sort_order' => 'required|integer'
        ]);

        foreach ($validated['items'] as $item) {
            ContactDirectory::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return redirect()->back();
    }
}
