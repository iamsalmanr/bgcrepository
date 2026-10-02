<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = Auth::user();
        $isSuperAdmin = $currentUser && $currentUser->role === 'super_admin';

        $search = $request->query('search');
        $role = $request->query('role');
        $status = $request->query('status');

        $query = User::query();

        // If not super admin, exclude super admin accounts completely
        if (!$isSuperAdmin) {
            $query->where('role', '!=', 'super_admin');
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('member_id', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('mobile', 'like', "%{$search}%");
            });
        }

        if ($role && $role !== 'all') {
            if (!$isSuperAdmin && $role === 'super_admin') {
                // Ignore super_admin filter for regular admins
            } else {
                $query->where('role', $role);
            }
        }

        if ($status && $status !== 'all') {
            if ($status === 'pending') {
                $query->where('is_active', false)->where('role', 'member');
            } elseif ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'disabled') {
                $query->where('is_active', false);
            }
        }

        $users = $query->orderBy('id', 'desc')->paginate(50)->withQueryString();

        $baseCountQuery = $isSuperAdmin ? User::query() : User::where('role', '!=', 'super_admin');

        $stats = [
            'total' => (clone $baseCountQuery)->count(),
            'active' => (clone $baseCountQuery)->where('is_active', true)->count(),
            'pending' => (clone $baseCountQuery)->where('role', 'member')->where('is_active', false)->count(),
            'disabled' => (clone $baseCountQuery)->where('is_active', false)->count(),
            'members' => (clone $baseCountQuery)->where('role', 'member')->count(),
            'admins' => (clone $baseCountQuery)->whereIn('role', $isSuperAdmin ? ['admin', 'super_admin'] : ['admin'])->count(),
        ];

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role ?? 'all',
                'status' => $status ?? 'all',
            ],
            'stats' => $stats,
            'isSuperAdmin' => $isSuperAdmin,
        ]);
    }

    public function create()
    {
        $isSuperAdmin = Auth::user() && Auth::user()->role === 'super_admin';

        return Inertia::render('Users/Create', [
            'isSuperAdmin' => $isSuperAdmin,
        ]);
    }

    public function store(Request $request)
    {
        $isSuperAdmin = Auth::user() && Auth::user()->role === 'super_admin';

        $roleValidation = $isSuperAdmin ? 'required|in:super_admin,admin,member' : 'required|in:member';

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => $roleValidation,
            'phone' => 'nullable|string|max:50',
            'mobile' => 'nullable|string|max:50',
            'rank_designation' => 'nullable|string|max:255',
            'profession' => 'nullable|string|max:255',
            'organization' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $assignedRole = $isSuperAdmin ? $validated['role'] : 'member';

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $assignedRole,
            'phone' => $validated['phone'] ?? null,
            'mobile' => $validated['mobile'] ?? null,
            'rank_designation' => $validated['rank_designation'] ?? null,
            'profession' => $validated['profession'] ?? null,
            'organization' => $validated['organization'] ?? null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('users.index')->with('success', 'Member account created successfully.');
    }

    public function edit(User $user)
    {
        $isSuperAdmin = Auth::user() && Auth::user()->role === 'super_admin';

        if (!$isSuperAdmin && $user->role === 'super_admin') {
            abort(403, 'Unauthorized access to Super Admin account.');
        }

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'isSuperAdmin' => $isSuperAdmin,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $isSuperAdmin = Auth::user() && Auth::user()->role === 'super_admin';

        if (!$isSuperAdmin && $user->role === 'super_admin') {
            abort(403, 'Unauthorized modification of Super Admin account.');
        }

        $roleValidation = $isSuperAdmin ? 'required|in:super_admin,admin,member' : 'nullable|in:admin,member';

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => $roleValidation,
            'phone' => 'nullable|string|max:50',
            'mobile' => 'nullable|string|max:50',
            'rank_designation' => 'nullable|string|max:255',
            'profession' => 'nullable|string|max:255',
            'organization' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'password' => 'nullable|string|min:6',
        ]);

        // Regular admin cannot elevate roles
        $assignedRole = $isSuperAdmin ? ($validated['role'] ?? $user->role) : $user->role;

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $assignedRole,
            'phone' => $validated['phone'] ?? null,
            'mobile' => $validated['mobile'] ?? null,
            'rank_designation' => $validated['rank_designation'] ?? null,
            'profession' => $validated['profession'] ?? null,
            'organization' => $validated['organization'] ?? null,
            'is_active' => $request->boolean('is_active', true),
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return redirect()->route('users.index')->with('success', "Profile for {$user->name} updated successfully.");
    }

    public function resetPassword(Request $request, User $user)
    {
        $isSuperAdmin = Auth::user() && Auth::user()->role === 'super_admin';

        if (!$isSuperAdmin && $user->role === 'super_admin') {
            abort(403, 'Unauthorized to reset Super Admin password.');
        }

        $request->validate([
            'new_password' => 'required|string|min:6',
        ]);

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return redirect()->back()->with('success', "Password for {$user->name} has been reset successfully.");
    }

    public function verifyMember(User $user)
    {
        $isSuperAdmin = Auth::user() && Auth::user()->role === 'super_admin';

        if (!$isSuperAdmin && $user->role === 'super_admin') {
            abort(403, 'Unauthorized.');
        }

        $user->update(['is_active' => true]);

        return redirect()->back()->with('success', "Member {$user->name} has been verified and granted portal dashboard access.");
    }

    public function toggleStatus(User $user)
    {
        $isSuperAdmin = Auth::user() && Auth::user()->role === 'super_admin';

        if (!$isSuperAdmin && $user->role === 'super_admin') {
            abort(403, 'Unauthorized to modify Super Admin status.');
        }

        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot disable your own active account.');
        }

        $user->update([
            'is_active' => !$user->is_active
        ]);

        $statusText = $user->is_active ? 'verified & active' : 'disabled';
        return redirect()->back()->with('success', "Member account for {$user->name} is now {$statusText}.");
    }

    public function impersonate(User $user)
    {
        $isSuperAdmin = Auth::user() && Auth::user()->role === 'super_admin';

        if (!$isSuperAdmin && $user->role === 'super_admin') {
            abort(403, 'Unauthorized to impersonate Super Admin.');
        }

        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You are already logged in as yourself.');
        }

        $adminId = Auth::id();
        session(['impersonator_id' => $adminId]);

        Auth::login($user);

        return redirect()->route('dashboard')->with('success', "Now viewing as {$user->name}.");
    }

    public function leaveImpersonation()
    {
        if (session()->has('impersonator_id')) {
            $adminId = session()->get('impersonator_id');
            session()->forget('impersonator_id');
            Auth::loginUsingId($adminId);

            return redirect()->route('users.index')->with('success', 'Returned to Admin session successfully.');
        }

        return redirect()->route('dashboard');
    }

    public function destroy(User $user)
    {
        $isSuperAdmin = Auth::user() && Auth::user()->role === 'super_admin';

        if (!$isSuperAdmin && $user->role === 'super_admin') {
            abort(403, 'Unauthorized to delete Super Admin.');
        }

        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();
        return redirect()->route('users.index')->with('success', "Member {$user->name} deleted successfully.");
    }
}
