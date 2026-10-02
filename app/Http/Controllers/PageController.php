<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index()
    {
        $pages = Page::latest()->get();
        return Inertia::render('AdminPages/Index', [
            'pages' => $pages
        ]);
    }

    public function create()
    {
        return Inertia::render('AdminPages/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $slug = Str::slug($request->title);
        
        // Ensure slug is unique
        $originalSlug = $slug;
        $count = 1;
        while (Page::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        Page::create([
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'is_published' => $request->is_published ?? true,
        ]);

        return redirect()->route('pages.index')->with('success', 'Page created successfully.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('AdminPages/Edit', [
            'page' => $page
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $slug = Str::slug($request->title);
        
        // Ensure slug is unique
        $originalSlug = $slug;
        $count = 1;
        while (Page::where('slug', $slug)->where('id', '!=', $page->id)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        $page->update([
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'is_published' => $request->has('is_published') ? $request->is_published : $page->is_published,
        ]);

        return redirect()->route('pages.index')->with('success', 'Page updated successfully.');
    }

    public function destroy(Page $page)
    {
        $page->delete();
        return redirect()->route('pages.index')->with('success', 'Page deleted successfully.');
    }
}
