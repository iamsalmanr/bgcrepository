<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\GalleryImage;
use App\Models\MediaItem;
use Illuminate\Support\Facades\Storage;

class GalleryImageController extends Controller
{
    public function index()
    {
        $galleryImages = GalleryImage::orderBy('order')->get();
        // Fetch media items so we can select from them
        $mediaImages = MediaItem::where('type', 'image')->latest()->get();

        return Inertia::render('Theme/Gallery/Index', [
            'galleryImages' => $galleryImages,
            'mediaImages' => $mediaImages
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'source' => 'required|in:upload,media',
            'image_file' => 'required_if:source,upload|image|max:10240',
            'media_path' => 'required_if:source,media|string',
        ]);

        $imagePath = '';

        if ($request->source === 'upload') {
            $path = $request->file('image_file')->store('gallery', 'public');
            $imagePath = $path;
        } else {
            $imagePath = $request->media_path;
        }

        $maxOrder = GalleryImage::max('order') ?? 0;

        GalleryImage::create([
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'image_path' => $imagePath,
            'is_active' => $request->boolean('is_active', true),
            'order' => $maxOrder + 1,
        ]);

        return redirect()->back()->with('success', 'Gallery image added successfully.');
    }

    public function update(Request $request, GalleryImage $gallery_image)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        // If replacing the image
        if ($request->has('source')) {
            $request->validate([
                'source' => 'required|in:upload,media',
                'image_file' => 'required_if:source,upload|image|max:10240',
                'media_path' => 'required_if:source,media|string',
            ]);

            if ($request->source === 'upload' && $request->hasFile('image_file')) {
                // We might want to delete the old image if it was uploaded to gallery/ specifically, but we'll leave it for now.
                $gallery_image->image_path = $request->file('image_file')->store('gallery', 'public');
            } elseif ($request->source === 'media' && $request->media_path) {
                $gallery_image->image_path = $request->media_path;
            }
        }

        $gallery_image->update([
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'is_active' => $request->boolean('is_active', $gallery_image->is_active),
            'image_path' => $gallery_image->image_path, // in case it was updated above
        ]);

        return redirect()->back()->with('success', 'Gallery image updated successfully.');
    }

    public function destroy(GalleryImage $gallery_image)
    {
        // Don't delete the actual file because it might be from the media library
        // We only delete the gallery entry
        $gallery_image->delete();

        return redirect()->back()->with('success', 'Gallery image removed successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:gallery_images,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            GalleryImage::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['success' => true]);
    }
}
