<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\TournamentRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TournamentRegistrationController extends Controller
{
    /**
     * Member / Player Tournament Self-Registration
     */
    public function register(Request $request, Tournament $tournament)
    {
        $user = Auth::user();

        // Check if member already registered
        if ($user) {
            $existing = TournamentRegistration::where('tournament_id', $tournament->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existing) {
                return redirect()->back()->with('info', 'You are already registered for this tournament.');
            }
        }

        $validated = $request->validate([
            'player_name' => 'required|string|max:255',
            'member_id' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'handicap' => 'nullable|integer|min:0|max:54',
            'category' => 'required|string|max:100',
            't_shirt_size' => 'nullable|string|max:10',
            'notes' => 'nullable|string|max:1000',
        ]);

        TournamentRegistration::create([
            'tournament_id' => $tournament->id,
            'user_id' => $user ? $user->id : null,
            'player_name' => $validated['player_name'],
            'member_id' => $user ? ($user->member_id ?: ($user->membership_number ?: null)) : ($validated['member_id'] ?? null),
            'email' => $validated['email'] ?? ($user ? $user->email : null),
            'phone' => $validated['phone'] ?? ($user ? $user->phone : null),
            'handicap' => intval($validated['handicap'] ?? 0),
            'category' => $validated['category'] ?? 'Regular Men',
            't_shirt_size' => $validated['t_shirt_size'] ?? null,
            'status' => 'confirmed', // Auto-confirm registration
            'notes' => $validated['notes'] ?? null,
            'registered_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Successfully registered for ' . $tournament->title . '!');
    }

    /**
     * Member Withdraw / Cancel Registration
     */
    public function cancel(TournamentRegistration $registration)
    {
        $user = Auth::user();

        if ($user && ($user->id === $registration->user_id || $user->role === 'admin' || $user->role === 'super_admin')) {
            $tournament = $registration->tournament;
            
            // Members can un-enroll until the match day starts
            if ($user->role === 'member' && $tournament && $tournament->start_date) {
                $start = \Carbon\Carbon::parse($tournament->start_date)->startOfDay();
                if (now()->gte($start)) {
                    return redirect()->back()->with('error', 'Cannot un-enroll once tournament match day has started.');
                }
            }

            $registration->delete();
            return redirect()->back()->with('success', 'Registration un-enrolled successfully.');
        }

        return redirect()->back()->with('error', 'Unauthorized action.');
    }

    /**
     * Admin: Add Player to Tournament Roster
     */
    public function adminStore(Request $request, Tournament $tournament)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'player_name' => 'required|string|max:255',
            'member_id' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'handicap' => 'nullable|integer|min:0|max:54',
            'category' => 'required|string|max:100',
            't_shirt_size' => 'nullable|string|max:10',
            'status' => 'required|in:registered,confirmed,waitlisted,cancelled',
            'notes' => 'nullable|string|max:1000',
        ]);

        TournamentRegistration::create([
            'tournament_id' => $tournament->id,
            'user_id' => $validated['user_id'] ?? null,
            'player_name' => $validated['player_name'],
            'member_id' => $validated['member_id'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'handicap' => intval($validated['handicap'] ?? 0),
            'category' => $validated['category'] ?? 'Regular Men',
            't_shirt_size' => $validated['t_shirt_size'] ?? null,
            'status' => $validated['status'] ?? 'confirmed',
            'notes' => $validated['notes'] ?? null,
            'registered_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Player added to tournament roster.');
    }

    /**
     * Admin: Update Player Registration
     */
    public function adminUpdate(Request $request, TournamentRegistration $registration)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'player_name' => 'required|string|max:255',
            'member_id' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'handicap' => 'nullable|integer|min:0|max:54',
            'category' => 'required|string|max:100',
            't_shirt_size' => 'nullable|string|max:10',
            'status' => 'required|in:registered,confirmed,waitlisted,cancelled',
            'notes' => 'nullable|string|max:1000',
        ]);

        $registration->update([
            'user_id' => $validated['user_id'] ?? null,
            'player_name' => $validated['player_name'],
            'member_id' => $validated['member_id'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'handicap' => intval($validated['handicap'] ?? 0),
            'category' => $validated['category'],
            't_shirt_size' => $validated['t_shirt_size'] ?? null,
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Player registration updated.');
    }

    /**
     * Admin: 1-Click Status Update
     */
    public function adminToggleStatus(Request $request, TournamentRegistration $registration)
    {
        $validated = $request->validate([
            'status' => 'required|in:registered,confirmed,waitlisted,cancelled',
        ]);

        $registration->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status updated to ' . ucfirst($validated['status']));
    }

    /**
     * Admin: Delete Player Registration
     */
    public function adminDestroy(TournamentRegistration $registration)
    {
        $registration->delete();
        return redirect()->back()->with('success', 'Player removed from tournament.');
    }
}
