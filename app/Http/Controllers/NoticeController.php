<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NoticeController extends Controller
{
    public function index()
    {
        return Inertia::render('Notices/Index', [
            'notices' => Notice::orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function create()
    {
        return redirect()->route('notices.index', ['action' => 'new']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'url' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,webp|max:25600',
            'content' => 'nullable|string',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('notices', 'public');
        }

        Notice::create([
            'title' => $validated['title'],
            'category' => $validated['category'] ?? 'General',
            'url' => $validated['url'] ?? null,
            'file_path' => $filePath,
            'content' => $validated['content'] ?? null,
            'is_active' => $request->boolean('is_active', true),
            'show_on_home' => $request->boolean('show_on_home', false),
        ]);

        return redirect()->route('notices.index')->with('success', 'Notice published successfully.');
    }

    public function edit(Notice $notice)
    {
        return redirect()->route('notices.index', ['edit' => $notice->id]);
    }

    public function update(Request $request, Notice $notice)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'url' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,webp|max:25600',
            'remove_file' => 'nullable|boolean',
            'content' => 'nullable|string',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
        ]);

        $filePath = $notice->file_path;
        if ($request->boolean('remove_file')) {
            if ($filePath && Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            $filePath = null;
        }

        if ($request->hasFile('file')) {
            if ($filePath && Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            $filePath = $request->file('file')->store('notices', 'public');
        }

        $notice->update([
            'title' => $validated['title'],
            'category' => $validated['category'] ?? $notice->category ?? 'General',
            'url' => $validated['url'] ?? null,
            'file_path' => $filePath,
            'content' => $validated['content'] ?? null,
            'is_active' => $request->boolean('is_active', $notice->is_active),
            'show_on_home' => $request->boolean('show_on_home', $notice->show_on_home),
        ]);

        return redirect()->route('notices.index')->with('success', 'Notice updated successfully.');
    }

    public function destroy(Notice $notice)
    {
        if ($notice->file_path && Storage::disk('public')->exists($notice->file_path)) {
            Storage::disk('public')->delete($notice->file_path);
        }

        $notice->delete();

        return redirect()->route('notices.index')->with('success', 'Notice deleted successfully.');
    }
}
