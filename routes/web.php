<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\HeroSlide;

use App\Models\GalleryImage;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'heroSlides' => HeroSlide::where('is_active', true)->orderBy('order')->get(),
        'galleryImages' => GalleryImage::where('is_active', true)->orderBy('order')->get()->map(function ($img) {
            $media = \App\Models\MediaItem::where('file_path', $img->image_path)->first();
            $img->folder = $media ? ($media->folder ?: 'Club Moments') : ($img->category ?: 'Club Moments');
            $img->category = $img->folder;
            return $img;
        }),
        'notices' => \App\Models\Notice::where('is_active', true)->orderBy('created_at', 'desc')->get(),
        'forms' => \App\Models\ClubForm::where('is_active', true)->orderBy('sort_order')->get(),
        'executiveMembers' => \App\Models\CommitteeMember::where('committee', 'Executive Committee')->orderBy('sort_order')->orderBy('id', 'asc')->get(),
        'partners' => \App\Models\Partner::where('is_active', true)->orderBy('sort_order')->get(),
        'quickLinks' => \App\Models\QuickLink::where('is_active', true)->orderBy('sort_order')->get(),
        'upcomingTournaments' => \App\Models\Tournament::where('is_active', true)->whereDate('start_date', '>=', now())->orderBy('start_date', 'asc')->take(5)->get(),
    ]);
});

Route::get('/notice-board', function () {
    return Inertia::render('NoticeBoard', [
        'notices' => \App\Models\Notice::where('is_active', true)->orderBy('created_at', 'desc')->get(),
    ]);
})->name('notices.public');

Route::get('/photo-gallery', function () {
    $galleryImages = \App\Models\GalleryImage::where('is_active', true)->orderBy('order')->get()->map(function ($img) {
        $media = \App\Models\MediaItem::where('file_path', $img->image_path)->first();
        $img->folder = $media ? ($media->folder ?: 'Club Moments') : ($img->category ?: 'Club Moments');
        $img->category = $img->folder;
        return $img;
    });

    return Inertia::render('Gallery', [
        'galleryImages' => $galleryImages,
        'mediaImages' => \App\Models\MediaItem::where('type', 'image')->orderBy('created_at', 'desc')->get(),
    ]);
})->name('gallery.public');

Route::get('/contact-us', function () {
    return Inertia::render('ContactUs', [
        'directories' => \App\Models\ContactDirectory::orderBy('column')->orderBy('sort_order')->get(),
    ]);
})->name('contact-us.public');

Route::get('/membership-applying-procedure', function () {
    $page = \App\Models\Page::where('slug', 'membership-applying-procedure')->where('is_published', true)->firstOrFail();
    return Inertia::render('Public/PageView', [
        'page' => $page,
    ]);
})->name('procedure.public');

// Membership Application Menu: redirects to sign up if not signed in, else to dashboard
Route::get('/golf/membership/application/menu', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('register');
})->name('membership.application.menu');

Route::get('/golf/membership/application', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('register');
});

Route::get('/membership-application', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('register');
})->name('membership.application');

Route::get('/membership/application', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('register');
});

Route::get('/dress-code', function () {
    return Inertia::render('Public/DressCode');
})->name('dress-code.public');

Route::get('/fees', function () {
    $page = \App\Models\Page::where('slug', 'fees')->where('is_published', true)->firstOrFail();
    return Inertia::render('Public/PageView', [
        'page' => $page,
    ]);
})->name('fees.public');

Route::get('/club-form', function () {
    return Inertia::render('Public/ClubForms', [
        'forms' => \App\Models\ClubForm::where('is_active', true)->orderBy('sort_order')->get(),
    ]);
})->name('club-form.public');

Route::get('/forms/{form}/view', [App\Http\Controllers\ClubFormController::class, 'viewFile'])->name('forms.view');
Route::get('/club-form/{form}/view', [App\Http\Controllers\ClubFormController::class, 'viewFile'])->name('forms.view.public');

Route::get('/tournament', function () {
    return Inertia::render('Public/Tournaments', [
        'type' => 'Club Tournaments',
        'initialStatus' => 'all',
        'tournaments' => \App\Models\Tournament::where('is_active', true)->with(['registrations.user'])->orderBy('sort_order')->orderBy('start_date', 'desc')->get(),
    ]);
})->name('tournaments.live.public');

Route::get('/tournaments_schedule_plan', function () {
    return Inertia::render('Public/Tournaments', [
        'type' => 'Upcoming Tournaments',
        'initialStatus' => 'upcoming',
        'tournaments' => \App\Models\Tournament::where('is_active', true)->with(['registrations.user'])->orderBy('sort_order')->orderBy('start_date', 'desc')->get(),
    ]);
})->name('tournaments.upcoming.public');

Route::get('/tournaments_results_archive', function () {
    return Inertia::render('Public/Tournaments', [
        'type' => 'Completed Tournaments',
        'initialStatus' => 'completed',
        'tournaments' => \App\Models\Tournament::where('is_active', true)->with(['registrations.user'])->orderBy('sort_order')->orderBy('start_date', 'desc')->get(),
    ]);
})->name('tournaments.completed.public');

Route::get('/tournament-result', function () {
    return Inertia::render('Public/TournamentResults', [
        'results' => \App\Models\TournamentResult::orderBy('id', 'desc')->get(),
    ]);
})->name('tournament-results.public');

Route::get('/hole-in-one-record', function () {
    return Inertia::render('Public/HoleInOnes', [
        'records' => \App\Models\HoleInOne::orderBy('id', 'desc')->get(),
    ]);
})->name('hole-in-ones.public');

Route::get('/list-of-winner', function () {
    return Inertia::render('Public/WinnerLists', [
        'records' => \App\Models\WinnerList::orderBy('id', 'desc')->get(),
    ]);
})->name('winner-lists.public');

Route::get('/flight-schedule', function () {
    return Inertia::render('Public/FlightSchedules', [
        'records' => \App\Models\FlightSchedule::orderBy('id', 'desc')->get(),
    ]);
})->name('flight-schedules.public');

use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TournamentController;

Route::get('/guest-room-rent', function () {
    return Inertia::render('Public/GuestRoomRent');
})->name('guest-room-rent.public');

// Curated Bangladesh Golf News (Public)
Route::get('/news', [App\Http\Controllers\GolfNewsController::class, 'index'])->name('news.public');
Route::get('/golf-news', fn() => redirect()->route('news.public'));

Route::get('/membership/pending', function (\Illuminate\Http\Request $request) {
    $user = $request->user();
    if (!$user) {
        return redirect()->route('login');
    }
    // If user is admin/super_admin or already active/verified member, redirect to dashboard
    if ($user->role !== 'member' || $user->is_active) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Auth/MembershipPending', [
        'user' => $user,
    ]);
})->middleware(['auth'])->name('membership.pending');

Route::middleware(['auth', 'verified', 'verified_member'])->group(function () {
    Route::get('/dashboard', function () {
        $stats = [
            'total_members' => \App\Models\User::where('role', 'member')->count(),
            'total_tournaments' => \App\Models\Tournament::count(),
            'total_notices' => \App\Models\Notice::count(),
            'total_committees' => \App\Models\CommitteeMember::distinct('committee')->count('committee'),
        ];

        $allTournaments = \App\Models\Tournament::where('is_active', true)->orderBy('start_date', 'asc')->get();
        $recentTournaments = \App\Models\Tournament::where('is_active', true)->orderBy('start_date', 'desc')->take(5)->get();
        $recentNotices = \App\Models\Notice::orderBy('created_at', 'desc')->take(5)->get();
        $recentForms = \App\Models\ClubForm::where('is_active', true)->orderBy('sort_order')->take(5)->get();

        return Inertia::render('Dashboard', [
            'dashboard_stats' => $stats,
            'allTournaments' => $allTournaments,
            'recentTournaments' => $recentTournaments,
            'recentNotices' => $recentNotices,
            'recentForms' => $recentForms,
        ]);
    })->name('dashboard');

    Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');

    // Scorecards (All authenticated members & admins)
    Route::resource('scorecards', App\Http\Controllers\ScorecardController::class)->except(['create', 'edit', 'show']);

    // Photo Gallery (Authenticated member & admin dashboard view)
    Route::get('/gallery', function () {
        $galleryImages = \App\Models\GalleryImage::where('is_active', true)->orderBy('order')->get()->map(function ($img) {
            $media = \App\Models\MediaItem::where('file_path', $img->image_path)->first();
            $img->folder = $media ? ($media->folder ?: 'Club Moments') : ($img->category ?: 'Club Moments');
            $img->category = $img->folder;
            return $img;
        });

        return Inertia::render('Gallery', [
            'galleryImages' => $galleryImages,
            'mediaImages' => \App\Models\MediaItem::where('type', 'image')->orderBy('created_at', 'desc')->get(),
        ]);
    })->name('gallery');

    // Tournament Self-Registration (All authenticated members)
    Route::post('/tournaments/{tournament}/register', [App\Http\Controllers\TournamentRegistrationController::class, 'register'])->name('tournaments.register');
    Route::delete('/tournament-registrations/{registration}/cancel', [App\Http\Controllers\TournamentRegistrationController::class, 'cancel'])->name('tournaments.registrations.cancel');

    // Admin & Super Admin Routes
    Route::middleware(['role:admin,super_admin'])->group(function () {
        // Committees (Boards & Categories)
        Route::post('/committees/reorder', [App\Http\Controllers\CommitteeController::class, 'reorder'])->name('committees.reorder');
        Route::post('/committees/{committee}/toggle-navbar', [App\Http\Controllers\CommitteeController::class, 'toggleNavbar'])->name('committees.toggle-navbar');
        Route::resource('committees', App\Http\Controllers\CommitteeController::class)->except(['show', 'create', 'edit']);

        // Committee Members
        Route::post('/committee-members/reorder', [App\Http\Controllers\CommitteeMemberController::class, 'reorder'])->name('committee-members.reorder');
        Route::put('/committee-members/{committee_member}/position', [App\Http\Controllers\CommitteeMemberController::class, 'updatePosition'])->name('committee-members.position');
        Route::resource('committee-members', App\Http\Controllers\CommitteeMemberController::class)->except(['show']);

        // Forms
        Route::post('/forms/reorder', [App\Http\Controllers\ClubFormController::class, 'reorder'])->name('forms.reorder');
        Route::resource('forms', App\Http\Controllers\ClubFormController::class)->except(['show']);

        // Contact Directory
        Route::post('/contact-directory/reorder', [App\Http\Controllers\ContactDirectoryController::class, 'reorder'])->name('contact-directory.reorder');
        Route::resource('contact-directory', App\Http\Controllers\ContactDirectoryController::class)->except(['show']);

        // Notices
        Route::resource('notices', App\Http\Controllers\NoticeController::class)->except(['show']);

        // Media Library
        Route::get('/media', [App\Http\Controllers\MediaController::class, 'index'])->name('media.index');
        Route::post('/media', [App\Http\Controllers\MediaController::class, 'store'])->name('media.store');
        Route::post('/media/folders/rename', [App\Http\Controllers\MediaController::class, 'renameFolder'])->name('media.folders.rename');
        Route::post('/media/folders/delete', [App\Http\Controllers\MediaController::class, 'deleteFolder'])->name('media.folders.delete');
        Route::delete('/media/{medium}', [App\Http\Controllers\MediaController::class, 'destroy'])->name('media.destroy');
        Route::post('/media/{medium}/toggle-gallery', [App\Http\Controllers\MediaController::class, 'toggleGallery'])->name('media.toggle-gallery');

        // Members & Users Management (Admin + Super Admin)
        Route::get('/members', [UserController::class, 'index'])->name('members.index');
        Route::post('/users/{user}/verify', [UserController::class, 'verifyMember'])->name('users.verify');
        Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
        Route::post('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::post('/users/{user}/impersonate', [UserController::class, 'impersonate'])->name('users.impersonate');
        Route::resource('users', UserController::class);

        // Curated News Management
        Route::post('/admin/news/sync', [App\Http\Controllers\GolfNewsController::class, 'sync'])->name('news.sync');
        Route::post('/admin/news/{news}/toggle', [App\Http\Controllers\GolfNewsController::class, 'toggle'])->name('news.toggle');

        // Tournaments & Scorecards Management
        Route::post('/tournaments/reorder', [TournamentController::class, 'reorder'])->name('tournaments.reorder');
        Route::resource('tournaments', TournamentController::class);
        Route::post('/admin/tournaments/{tournament}/registrations', [App\Http\Controllers\TournamentRegistrationController::class, 'adminStore'])->name('admin.tournaments.registrations.store');
        Route::put('/admin/tournament-registrations/{registration}', [App\Http\Controllers\TournamentRegistrationController::class, 'adminUpdate'])->name('admin.tournaments.registrations.update');
        Route::post('/admin/tournament-registrations/{registration}/status', [App\Http\Controllers\TournamentRegistrationController::class, 'adminToggleStatus'])->name('admin.tournaments.registrations.status');
        Route::delete('/admin/tournament-registrations/{registration}', [App\Http\Controllers\TournamentRegistrationController::class, 'adminDestroy'])->name('admin.tournaments.registrations.destroy');

        Route::resource('tournament-results', App\Http\Controllers\TournamentResultController::class)->except(['show']);
        Route::resource('hole-in-ones', App\Http\Controllers\HoleInOneController::class)->except(['show']);
        Route::resource('winner-lists', App\Http\Controllers\WinnerListController::class)->except(['show']);
        Route::resource('flight-schedules', App\Http\Controllers\FlightScheduleController::class)->except(['show']);
        Route::post('/scorecards/{scorecard}/approve', [App\Http\Controllers\ScorecardController::class, 'approve'])->name('scorecards.approve');
        Route::post('/scorecards/{scorecard}/reject', [App\Http\Controllers\ScorecardController::class, 'reject'])->name('scorecards.reject');
        Route::post('/scorecards/seed-samples', [App\Http\Controllers\ScorecardController::class, 'seedInitialScores'])->name('scorecards.seed');

        // Menus (Theme Customization)
        Route::resource('menus', App\Http\Controllers\MenuController::class)->except(['create', 'edit', 'show']);
        Route::get('/menus/{menu}/builder', [App\Http\Controllers\MenuController::class, 'builder'])->name('menus.builder');
        Route::post('/menus/{menu}/items', [App\Http\Controllers\MenuController::class, 'saveItems'])->name('menus.items.save');

        // Hero Slides (Theme Customization)
        Route::post('/hero-slides/reorder', [App\Http\Controllers\HeroSlideController::class, 'reorder'])->name('hero-slides.reorder');
        Route::put('/hero-slides/{hero_slide}/position', [App\Http\Controllers\HeroSlideController::class, 'updatePosition'])->name('hero-slides.position');
        Route::resource('hero-slides', App\Http\Controllers\HeroSlideController::class)->except(['create', 'edit', 'show']);

        // Gallery Images (Theme Customization)
        Route::post('/theme/gallery-images/reorder', [App\Http\Controllers\GalleryImageController::class, 'reorder'])->name('gallery-images.reorder');
        Route::resource('theme/gallery-images', App\Http\Controllers\GalleryImageController::class)->except(['show', 'create', 'edit']);

        // Partners (Theme Customization)
        Route::post('/theme/partners/reorder', [App\Http\Controllers\PartnerController::class, 'reorder'])->name('partners.reorder');
        Route::resource('theme/partners', App\Http\Controllers\PartnerController::class)->except(['show', 'create', 'edit']);

        // Quick Links (Theme Customization)
        Route::post('/theme/quick-links/reorder', [App\Http\Controllers\QuickLinkController::class, 'reorder'])->name('quick-links.reorder');
        Route::post('/theme/quick-links/{quick_link}/toggle-active', [App\Http\Controllers\QuickLinkController::class, 'toggleActive'])->name('quick-links.toggle-active');
        Route::resource('theme/quick-links', App\Http\Controllers\QuickLinkController::class)->except(['show']);

        // Footer Settings (Theme Customization)
        Route::get('/theme/footer', [App\Http\Controllers\FooterSettingController::class, 'index'])->name('footer-settings.index');
        Route::post('/theme/footer', [App\Http\Controllers\FooterSettingController::class, 'update'])->name('footer-settings.update');

        // Homepage Sections & Media Settings (Theme Customization)
        Route::get('/theme/homepage-sections', [App\Http\Controllers\HomepageSectionController::class, 'index'])->name('homepage-sections.index');
        Route::post('/theme/homepage-sections', [App\Http\Controllers\HomepageSectionController::class, 'update'])->name('homepage-sections.update');
    });

    // Impersonation Leave Route
    Route::post('/impersonate/leave', [UserController::class, 'leaveImpersonation'])->name('impersonate.leave');

    // Super Admin Only Routes
    Route::middleware(['role:super_admin'])->group(function () {
        // Settings
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

        // Pages
        Route::resource('pages', App\Http\Controllers\PageController::class)->except(['show']);
    });
});

require __DIR__.'/auth.php';

// Dynamic Fallback for Committees and Custom Pages (must be defined last)
Route::get('/{slug}', function ($slug) {
    $slug = strtolower($slug);
    $committee = \App\Models\Committee::where('slug', $slug)->first();
    
    if ($committee) {
        $committeeName = $committee->name;
    } else {
        // Convert slug back to Title Case, e.g. "executive-committee" -> "Executive Committee"
        $committeeName = ucwords(str_replace('-', ' ', $slug));
        
        // Exception for specific names
        if ($slug === 'audit-finance-committee' || $slug === 'audit-and-finance-committee') {
            $committeeName = 'Audit & Finance Committee';
        } elseif ($slug === 'entertainment-cultural-committee' || $slug === 'entertainment-and-cultural-committee') {
            $committeeName = 'Entertainment & Cultural Committee';
        } elseif ($slug === 'grounds-rules-committee' || $slug === 'grounds-and-rules-committee') {
            $committeeName = 'Grounds & Rules Committee';
        }
    }

    $members = \App\Models\CommitteeMember::where('committee', $committeeName)
                                ->orderBy('sort_order')
                                ->orderBy('id', 'asc')
                                ->get();

    if ($committee || $members->isNotEmpty()) {
        return Inertia::render('Committee', [
            'committeeName' => $committeeName,
            'committee' => $committee,
            'members' => $members
        ]);
    }

    // Check if it matches a custom Page
    $page = \App\Models\Page::where('slug', $slug)->where('is_published', true)->first();
    if ($page) {
        return Inertia::render('Public/PageView', [
            'page' => $page,
        ]);
    }

    abort(404);
})->where('slug', '[a-zA-Z0-9_-]+')->name('committee.public');
