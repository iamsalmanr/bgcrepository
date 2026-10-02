<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HeroSlideController extends Controller
{
    public function index()
    {
        return Inertia::render('Theme/Hero/Index', [
            'slides' => HeroSlide::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
        ]);

        $path = $request->file('image')->store('hero_slides', 'public');
        $maxOrder = HeroSlide::max('order') ?? -1;

        HeroSlide::create([
            'image_path' => $path,
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'order' => $maxOrder + 1,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Slide created successfully.');
    }

    public function update(Request $request, HeroSlide $heroSlide)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if (Storage::disk('public')->exists($heroSlide->image_path)) {
                Storage::disk('public')->delete($heroSlide->image_path);
            }
            $heroSlide->image_path = $request->file('image')->store('hero_slides', 'public');
        }

        $heroSlide->title = $request->title;
        $heroSlide->subtitle = $request->subtitle;
        
        if ($request->has('is_active')) {
            $heroSlide->is_active = $request->is_active;
        }

        $heroSlide->save();

        return redirect()->back()->with('success', 'Slide updated successfully.');
    }

    public function destroy(HeroSlide $heroSlide)
    {
        if (Storage::disk('public')->exists($heroSlide->image_path)) {
            Storage::disk('public')->delete($heroSlide->image_path);
        }
        $heroSlide->delete();

        return redirect()->back()->with('success', 'Slide deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'slides' => 'required|array',
            'slides.*.id' => 'required|exists:hero_slides,id',
            'slides.*.order' => 'required|integer',
        ]);

        foreach ($request->slides as $slideData) {
            HeroSlide::where('id', $slideData['id'])->update(['order' => $slideData['order']]);
        }

        return redirect()->back()->with('success', 'Slides reordered successfully.');
    }

    public function updatePosition(Request $request, HeroSlide $heroSlide)
    {
        $request->validate([
            'image_position' => 'required|string|max:50',
            'text_position' => 'nullable|string|max:50',
            'image_position_mobile' => 'nullable|string|max:50',
            'text_position_mobile' => 'nullable|string|max:50',
        ]);

        $heroSlide->update([
            'image_position' => $request->image_position,
            'text_position' => $request->text_position ?? $heroSlide->text_position,
            'image_position_mobile' => $request->image_position_mobile ?? $heroSlide->image_position_mobile,
            'text_position_mobile' => $request->text_position_mobile ?? $heroSlide->text_position_mobile,
        ]);

        return redirect()->back()->with('success', 'Slide position updated successfully.');
    }
}
