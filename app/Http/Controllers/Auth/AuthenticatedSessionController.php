<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        $enabled = \App\Models\Setting::where('key', 'google_login_enabled')->value('value');
        $clientId = \App\Models\Setting::where('key', 'google_client_id')->value('value') ?: config('services.google.client_id');
        $clientSecret = \App\Models\Setting::where('key', 'google_client_secret')->value('value') ?: config('services.google.client_secret');

        $googleLoginEnabled = ($enabled !== '0') && !empty($clientId) && !empty($clientSecret);

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'googleLoginEnabled' => (bool) $googleLoginEnabled,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();
        if ($user && $user->role === 'member' && !$user->is_active) {
            return redirect()->route('membership.pending');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
