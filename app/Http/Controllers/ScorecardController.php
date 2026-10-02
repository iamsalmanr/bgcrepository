<?php

namespace App\Http\Controllers;

use App\Models\Scorecard;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScorecardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $isMember = $user->role === 'member';
        $isAdmin = in_array($user->role, ['admin', 'super_admin']);

        $query = Scorecard::with(['user', 'tournament', 'creator', 'approver'])->latest('played_at');

        // Status filter
        if ($status = $request->input('status')) {
            if (in_array($status, ['approved', 'pending', 'rejected'])) {
                $query->where('status', $status);
            }
        }

        // If member, prioritize showing their own scorecards or allow filter
        if ($isMember) {
            $viewMode = $request->input('view', 'my'); // 'my' or 'all'
            if ($viewMode === 'my') {
                $query->where('user_id', $user->id);
            } else {
                // When viewing all scorecards, members only see approved official scorecards
                if (!$request->filled('status')) {
                    $query->where('status', 'approved');
                }
            }
        }

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('player_name', 'like', "%{$search}%")
                  ->orWhere('member_id', 'like', "%{$search}%")
                  ->orWhere('competition', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Tournament / Competition filter
        if ($tournamentId = $request->input('tournament_id')) {
            $query->where('tournament_id', $tournamentId);
        }

        if ($roundType = $request->input('round_type')) {
            $query->where('round_type', $roundType);
        }

        $scorecards = $query->paginate(15)->withQueryString();

        // Calculate statistics
        $allApprovedScorecards = Scorecard::where('status', 'approved')->get();
        $userApprovedScorecards = $isMember ? Scorecard::where('user_id', $user->id)->where('status', 'approved')->get() : collect();
        $userAllScorecards = $isMember ? Scorecard::where('user_id', $user->id)->get() : collect();

        $pendingApprovalsCount = Scorecard::where('status', 'pending')->count();
        $myPendingCount = $isMember ? Scorecard::where('user_id', $user->id)->where('status', 'pending')->count() : 0;

        $stats = [
            'total_rounds' => $allApprovedScorecards->count(),
            'member_rounds' => $allApprovedScorecards->whereNotNull('user_id')->count(),
            'avg_gross' => $allApprovedScorecards->count() > 0 ? round($allApprovedScorecards->avg('gross_total'), 1) : 0,
            'best_gross' => $allApprovedScorecards->count() > 0 ? $allApprovedScorecards->min('gross_total') : 0,
            'pending_approvals' => $pendingApprovalsCount,
            // Member specific stats
            'my_rounds' => $userApprovedScorecards->count(),
            'my_total_submitted' => $userAllScorecards->count(),
            'my_pending' => $myPendingCount,
            'my_best' => $userApprovedScorecards->count() > 0 ? $userApprovedScorecards->min('gross_total') : null,
            'my_avg' => $userApprovedScorecards->count() > 0 ? round($userApprovedScorecards->avg('gross_total'), 1) : null,
            'my_lowest_net' => $userApprovedScorecards->count() > 0 ? $userApprovedScorecards->min('net_score') : null,
        ];

        $members = User::where('is_active', true)
            ->select('id', 'name', 'email', 'member_id', 'rank_designation', 'profile_picture')
            ->orderBy('name')
            ->get();

        $tournaments = Tournament::where('is_active', true)
            ->select('id', 'title', 'start_date', 'status')
            ->latest('start_date')
            ->get();

        return Inertia::render('Scorecards/Index', [
            'scorecards' => $scorecards,
            'stats' => $stats,
            'members' => $members,
            'tournaments' => $tournaments,
            'filters' => $request->only(['search', 'tournament_id', 'round_type', 'view', 'status']),
            'isMember' => $isMember,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $isMember = $user->role === 'member';
        $isAdmin = in_array($user->role, ['admin', 'super_admin']);

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'player_name' => 'required|string|max:255',
            'member_id' => 'nullable|string|max:100',
            'competition' => 'nullable|string|max:255',
            'tournament_id' => 'nullable|exists:tournaments,id',
            'played_at' => 'required|date',
            'tee_type' => 'required|in:men,ladies',
            'round_type' => 'required|in:9_holes,18_holes',
            'handicap' => 'nullable|integer|min:0|max:54',
            'scores_r1' => 'required|array|size:9',
            'scores_r1.*' => 'required|integer|min:1|max:25',
            'scores_r2' => 'nullable|array',
            'marker_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $r1Scores = array_map('intval', $validated['scores_r1']);
        $grossR1 = array_sum($r1Scores);

        $grossR2 = null;
        $r2Scores = null;
        if ($validated['round_type'] === '18_holes' && !empty($validated['scores_r2'])) {
            $r2Scores = array_map('intval', $validated['scores_r2']);
            $grossR2 = array_sum($r2Scores);
        }

        $grossTotal = $grossR1 + ($grossR2 ?? 0);
        $handicap = intval($validated['handicap'] ?? 0);
        $netScore = max(0, $grossTotal - $handicap);

        $targetUserId = $isMember ? $user->id : ($validated['user_id'] ?? null);
        $memberId = null;
        if ($targetUserId) {
            $regUser = User::find($targetUserId);
            $memberId = $regUser ? ($regUser->member_id ?: ($regUser->membership_number ?: null)) : null;
        }

        $status = $isAdmin ? 'approved' : 'pending';
        $approvedBy = $isAdmin ? $user->id : null;
        $approvedAt = $isAdmin ? now() : null;

        Scorecard::create([
            'user_id' => $targetUserId,
            'player_name' => $validated['player_name'],
            'member_id' => $memberId,
            'competition' => $validated['competition'] ?? null,
            'tournament_id' => $validated['tournament_id'] ?? null,
            'played_at' => $validated['played_at'],
            'tee_type' => $validated['tee_type'],
            'round_type' => $validated['round_type'],
            'handicap' => $handicap,
            'scores_r1' => $r1Scores,
            'scores_r2' => $r2Scores,
            'gross_r1' => $grossR1,
            'gross_r2' => $grossR2,
            'gross_total' => $grossTotal,
            'net_score' => $netScore,
            'status' => $status,
            'marker_name' => $validated['marker_name'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'created_by' => $user->id,
            'approved_by' => $approvedBy,
            'approved_at' => $approvedAt,
        ]);

        $message = $isMember
            ? 'Scorecard submitted successfully! It is currently pending review and will be published once approved by the club administrator.'
            : 'Scorecard recorded and published successfully.';

        return redirect()->back()->with('success', $message);
    }

    public function update(Request $request, Scorecard $scorecard)
    {
        $user = Auth::user();
        $isMember = $user->role === 'member';
        $isAdmin = in_array($user->role, ['admin', 'super_admin']);

        if ($isMember && $scorecard->user_id !== $user->id && $scorecard->created_by !== $user->id) {
            abort(403, 'Unauthorized to update this scorecard.');
        }

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'player_name' => 'required|string|max:255',
            'member_id' => 'nullable|string|max:100',
            'competition' => 'nullable|string|max:255',
            'tournament_id' => 'nullable|exists:tournaments,id',
            'played_at' => 'required|date',
            'tee_type' => 'required|in:men,ladies',
            'round_type' => 'required|in:9_holes,18_holes',
            'handicap' => 'nullable|integer|min:0|max:54',
            'scores_r1' => 'required|array|size:9',
            'scores_r1.*' => 'required|integer|min:1|max:25',
            'scores_r2' => 'nullable|array',
            'status' => 'nullable|in:pending,approved,rejected',
            'marker_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $r1Scores = array_map('intval', $validated['scores_r1']);
        $grossR1 = array_sum($r1Scores);

        $grossR2 = null;
        $r2Scores = null;
        if ($validated['round_type'] === '18_holes' && !empty($validated['scores_r2'])) {
            $r2Scores = array_map('intval', $validated['scores_r2']);
            $grossR2 = array_sum($r2Scores);
        }

        $grossTotal = $grossR1 + ($grossR2 ?? 0);
        $handicap = intval($validated['handicap'] ?? 0);
        $netScore = max(0, $grossTotal - $handicap);

        $targetUserId = $isMember ? $user->id : ($validated['user_id'] ?? null);
        $memberId = null;
        if ($targetUserId) {
            $regUser = User::find($targetUserId);
            $memberId = $regUser ? ($regUser->member_id ?: ($regUser->membership_number ?: null)) : null;
        }

        // When a member updates their scorecard, it goes to 'pending' approval and is hidden from official records until approved by admin
        if ($isMember) {
            $newStatus = 'pending';
            $approvedBy = null;
            $approvedAt = null;
        } else {
            $newStatus = $validated['status'] ?? $scorecard->status ?? 'approved';
            $approvedBy = $newStatus === 'approved' ? ($scorecard->approved_by ?? $user->id) : null;
            $approvedAt = $newStatus === 'approved' ? ($scorecard->approved_at ?? now()) : null;
        }

        $scorecard->update([
            'user_id' => $targetUserId,
            'player_name' => $validated['player_name'],
            'member_id' => $memberId,
            'competition' => $validated['competition'] ?? null,
            'tournament_id' => $validated['tournament_id'] ?? null,
            'played_at' => $validated['played_at'],
            'tee_type' => $validated['tee_type'],
            'round_type' => $validated['round_type'],
            'handicap' => $handicap,
            'scores_r1' => $r1Scores,
            'scores_r2' => $r2Scores,
            'gross_r1' => $grossR1,
            'gross_r2' => $grossR2,
            'gross_total' => $grossTotal,
            'net_score' => $netScore,
            'status' => $newStatus,
            'approved_by' => $approvedBy,
            'approved_at' => $approvedAt,
            'marker_name' => $validated['marker_name'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        $message = $isMember
            ? 'Scorecard update submitted successfully! It is currently pending review and will appear on official club records once approved by the administrator.'
            : 'Scorecard updated successfully.';

        return redirect()->back()->with('success', $message);
    }

    public function destroy(Scorecard $scorecard)
    {
        $user = Auth::user();
        if ($user->role === 'member' && $scorecard->user_id !== $user->id && $scorecard->created_by !== $user->id) {
            abort(403, 'Unauthorized to delete this scorecard.');
        }

        $scorecard->delete();
        return redirect()->back()->with('success', 'Scorecard deleted successfully.');
    }

    public function approve(Scorecard $scorecard)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['admin', 'super_admin'])) {
            abort(403, 'Only administrators can approve scorecards.');
        }

        $scorecard->update([
            'status' => 'approved',
            'approved_by' => $user->id,
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        return redirect()->back()->with('success', "Scorecard for {$scorecard->player_name} approved and verified successfully.");
    }

    public function reject(Request $request, Scorecard $scorecard)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['admin', 'super_admin'])) {
            abort(403, 'Only administrators can reject scorecards.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'nullable|string|max:500',
        ]);

        $scorecard->update([
            'status' => 'rejected',
            'approved_by' => $user->id,
            'approved_at' => now(),
            'rejection_reason' => $validated['rejection_reason'] ?? 'Unverified or incorrect strokes',
        ]);

        return redirect()->back()->with('success', "Scorecard for {$scorecard->player_name} marked as rejected.");
    }

    public function seedInitialScores()
    {
        if (Scorecard::count() > 0) {
            return redirect()->back()->with('info', 'Scorecards already exist.');
        }

        $member = User::where('role', 'member')->first() ?? User::first();

        // Seed authentic scorecards from Bogura Golf Club physical card
        Scorecard::create([
            'user_id' => $member ? $member->id : null,
            'player_name' => 'Lt Col Kamrul',
            'member_id' => 'BGC-260001',
            'competition' => 'President Cup Golf Tournament 2026',
            'played_at' => now()->subDays(2)->format('Y-m-d'),
            'tee_type' => 'men',
            'round_type' => '9_holes',
            'handicap' => 12,
            'scores_r1' => [5, 8, 5, 6, 7, 5, 6, 6, 5], // Gross 53
            'gross_r1' => 53,
            'gross_total' => 53,
            'net_score' => 41.0,
            'status' => 'approved',
            'marker_name' => 'Lt Col Eshraq',
            'notes' => 'Official Bogura Golf Club 9-hole regulation round.',
            'created_by' => Auth::id(),
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        Scorecard::create([
            'user_id' => null,
            'player_name' => 'Lt Col Eshraq',
            'member_id' => 'BGC-260002',
            'competition' => 'President Cup Golf Tournament 2026',
            'played_at' => now()->subDays(2)->format('Y-m-d'),
            'tee_type' => 'men',
            'round_type' => '9_holes',
            'handicap' => 18,
            'scores_r1' => [7, 10, 5, 7, 11, 4, 8, 4, 7], // Gross 63
            'gross_r1' => 63,
            'gross_total' => 63,
            'net_score' => 45.0,
            'status' => 'approved',
            'marker_name' => 'Lt Col Kamrul',
            'notes' => 'Tough putting on Hole 5 Bermuda green.',
            'created_by' => Auth::id(),
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        Scorecard::create([
            'user_id' => null,
            'player_name' => 'KO Ashif',
            'member_id' => 'BGC-260004',
            'competition' => 'Monthly Medal Round',
            'played_at' => now()->subDays(5)->format('Y-m-d'),
            'tee_type' => 'men',
            'round_type' => '9_holes',
            'handicap' => 14,
            'scores_r1' => [6, 12, 9, 6, 10, 4, 7, 6, 5], // Gross 65
            'gross_r1' => 65,
            'gross_total' => 65,
            'net_score' => 51.0,
            'status' => 'approved',
            'marker_name' => 'Maj Gen John Doe',
            'notes' => 'BGC 9-Hole afternoon fixture.',
            'created_by' => Auth::id(),
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Initial Bogura Golf Club scorecards seeded successfully.');
    }
}

