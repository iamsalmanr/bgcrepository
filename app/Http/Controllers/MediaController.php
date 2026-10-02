<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MediaItem;
use App\Models\GalleryImage;
use App\Models\Tournament;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'image');
        $tournamentId = $request->query('tournament_id');

        $query = MediaItem::where('type', $type);
        if ($tournamentId) {
            $query->where('tournament_id', $tournamentId);
        }

        $media = $query->latest()->get()->map(function($item) {
            $item->in_gallery = GalleryImage::where('image_path', $item->file_path)->exists();
            $item->load('tournament');
            return $item;
        });

        // System baseline folder structure with subfolders
        $systemFolders = [
            'General',
            'Course & Grounds',
            'Course & Grounds/Holes 1-9',
            'Course & Grounds/Fairways & Greens',
            'Clubhouse & Dining',
            'Clubhouse & Dining/VIP Suites',
            'Clubhouse & Dining/Dining Lounge',
            'Tournaments',
            'Tournaments/President Cup 2026',
            'Tournaments/Victory Day Cup',
            'Events & Celebrations',
            'Practice & Amenities'
        ];

        $dbFolders = MediaItem::whereNotNull('folder')->distinct()->pluck('folder')->toArray();
        $allFolders = array_values(array_unique(array_filter(array_merge($systemFolders, $dbFolders))));

        $tournaments = Tournament::latest()->get(['id', 'title']);

        return Inertia::render('Media/Index', [
            'media' => $media,
            'type' => $type,
            'tournaments' => $tournaments,
            'currentTournamentId' => $tournamentId,
            'folders' => $allFolders,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:15360',
            'type' => 'required|in:image,file',
            'folder' => 'nullable|string|max:255',
            'tournament_id' => 'nullable|exists:tournaments,id',
        ]);

        $folder = trim($request->folder ?: 'General', '/');

        foreach ($request->file('files') as $file) {
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();
            $size = $file->getSize();

            $path = $file->store('media', 'public');

            MediaItem::create([
                'name' => $originalName,
                'file_path' => $path,
                'mime_type' => $mimeType,
                'size' => $size,
                'type' => $request->type,
                'folder' => $folder,
                'tournament_id' => $request->tournament_id
            ]);
        }

        return redirect()->back()->with('success', 'Files uploaded successfully into ' . $folder . '.');
    }

    public function update(Request $request, MediaItem $medium)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'folder' => 'nullable|string|max:100',
            'tournament_id' => 'nullable|exists:tournaments,id',
        ]);

        $medium->update([
            'name' => $validated['name'],
            'folder' => $validated['folder'] ?? $medium->folder,
            'tournament_id' => $validated['tournament_id'] ?? $medium->tournament_id,
        ]);

        return redirect()->back()->with('success', 'File details updated successfully.');
    }

    public function destroy(MediaItem $medium)
    {
        if (Storage::disk('public')->exists($medium->file_path)) {
            Storage::disk('public')->delete($medium->file_path);
        }

        // Also clean up from public gallery if present
        GalleryImage::where('image_path', $medium->file_path)->delete();

        $medium->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }

    public function toggleGallery(MediaItem $medium)
    {
        $galleryImage = GalleryImage::where('image_path', $medium->file_path)->first();
        if ($galleryImage) {
            $galleryImage->delete();
            return redirect()->back()->with('success', 'Image removed from public gallery.');
        } else {
            GalleryImage::create([
                'image_path' => $medium->file_path,
                'title' => $medium->name,
                'category' => $medium->folder ?? 'Club Amenities',
                'is_active' => true,
                'order' => 0
            ]);
            return redirect()->back()->with('success', 'Image added to public gallery.');
        }
    }

    public function renameFolder(Request $request)
    {
        $request->validate([
            'old_path' => 'required|string',
            'new_path' => 'required|string',
        ]);

        $oldPath = trim($request->old_path, '/');
        $newPath = trim($request->new_path, '/');

        MediaItem::where('folder', $oldPath)->update(['folder' => $newPath]);

        $subItems = MediaItem::where('folder', 'like', $oldPath . '/%')->get();
        foreach ($subItems as $item) {
            $updated = $newPath . substr($item->folder, strlen($oldPath));
            $item->update(['folder' => $updated]);
        }

        return redirect()->back()->with('success', 'Folder renamed to "' . $newPath . '".');
    }

    public function deleteFolder(Request $request)
    {
        $request->validate([
            'folder_path' => 'required|string',
        ]);

        $folderPath = trim($request->folder_path, '/');

        $items = MediaItem::where('folder', $folderPath)
            ->orWhere('folder', 'like', $folderPath . '/%')
            ->get();

        foreach ($items as $item) {
            if (Storage::disk('public')->exists($item->file_path)) {
                Storage::disk('public')->delete($item->file_path);
            }
            GalleryImage::where('image_path', $item->file_path)->delete();
            $item->delete();
        }

        return redirect()->back()->with('success', 'Folder "' . $folderPath . '" deleted successfully.');
    }
}
