<?php

namespace App\Http\Controllers;

use App\Models\GolfNews;
use App\Services\GolfNewsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GolfNewsController extends Controller
{
    /**
     * Display the Bangladesh Golf News feed.
     */
    public function index(Request $request, GolfNewsService $newsService)
    {
        // Auto-seed if empty, or periodically refresh if more than 3 hours have passed
        if (GolfNews::count() === 0) {
            $newsService->syncNews();
            cache()->put('golf_news_last_auto_sync', now(), now()->addHours(3));
        } else {
            // Check if periodic auto-sync should run
            if (!cache()->has('golf_news_last_auto_sync')) {
                cache()->put('golf_news_last_auto_sync', now(), now()->addHours(3));
                try {
                    $newsService->syncNews();
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning('Periodic news sync failed: ' . $e->getMessage());
                }
            } else {
                $newsService->cacheAllExistingImages();
            }
        }

        $query = GolfNews::query();

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%")
                  ->orWhere('source_name', 'like', "%{$search}%");
            });
        }

        // Source filter
        if ($source = $request->input('source')) {
            if ($source !== 'all') {
                $query->where('source_name', $source);
            }
        }

        // Language filter: 'all', 'bn', 'en'
        $currentLang = $request->input('lang', 'all');
        if (in_array($currentLang, ['bn', 'en'])) {
            $query->where('language', $currentLang);
        }

        $user = $request->user();
        $isAdmin = $user && in_array($user->role, ['admin', 'super_admin']);

        // Non-admins see only active news
        if (!$isAdmin) {
            $query->active();
        }

        $news = $query->recent()->paginate(12)->withQueryString();

        // Language counts
        $bnCount = GolfNews::where('language', 'bn')->when(!$isAdmin, fn($q) => $q->active())->count();
        $enCount = GolfNews::where('language', 'en')->when(!$isAdmin, fn($q) => $q->active())->count();
        $totalCount = GolfNews::when(!$isAdmin, fn($q) => $q->active())->count();

        // Distinct sources for filtering tabs
        $sources = GolfNews::select('source_name')
            ->distinct()
            ->orderBy('source_name')
            ->pluck('source_name')
            ->toArray();

        return Inertia::render('Public/News', [
            'news' => $news,
            'sources' => $sources,
            'filters' => [
                'search' => $request->input('search', ''),
                'source' => $request->input('source', 'all'),
                'lang' => $currentLang,
            ],
            'counts' => [
                'total' => $totalCount,
                'bn' => $bnCount,
                'en' => $enCount,
            ],
            'isAdmin' => $isAdmin,
            'lastSyncedAt' => GolfNews::latest('updated_at')->value('updated_at')?->diffForHumans() ?? 'Recently',
        ]);
    }

    /**
     * Admin action: Trigger online news synchronization.
     */
    public function sync(GolfNewsService $newsService)
    {
        $result = $newsService->syncNews();

        return back()->with('success', "News feed updated successfully! Synced {$result['total_synced']} Bangladesh golf news articles.");
    }

    /**
     * Admin action: Toggle visibility of a news article.
     */
    public function toggle(GolfNews $news)
    {
        $news->is_active = !$news->is_active;
        $news->save();

        $status = $news->is_active ? 'visible' : 'hidden';
        return back()->with('success', "News item marked as {$status}.");
    }
}
