<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class GoogleAuthController extends Controller
{
    /**
     * Configure Google OAuth credentials dynamically from database settings.
     */
    protected function setupGoogleConfig(): bool
    {
        $enabled = Setting::where('key', 'google_login_enabled')->value('value');
        if ($enabled === '0') {
            return false;
        }

        $clientId = Setting::where('key', 'google_client_id')->value('value') ?: config('services.google.client_id');
        $clientSecret = Setting::where('key', 'google_client_secret')->value('value') ?: config('services.google.client_secret');
        $redirect = Setting::where('key', 'google_redirect_uri')->value('value') ?: config('services.google.redirect', url('/auth/google/callback'));

        if (empty($clientId) || empty($clientSecret)) {
            return false;
        }

        config([
            'services.google.client_id' => $clientId,
            'services.google.client_secret' => $clientSecret,
            'services.google.redirect' => $redirect,
        ]);

        return true;
    }

    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        if (!$this->setupGoogleConfig()) {
            return redirect()->route('login')->with('status', 'Google Login is currently disabled or credentials are not configured.');
        }

        try {
            return Socialite::driver('google')->redirect();
        } catch (Exception $e) {
            return redirect()->route('login')->with('status', 'Failed to connect to Google authentication.');
        }
    }

    /**
     * Obtain the user information from Google.
     */
    public function handleGoogleCallback()
    {
        if (!$this->setupGoogleConfig()) {
            return redirect()->route('login')->with('status', 'Google Login is currently disabled or not configured.');
        }

        try {
            $googleUser = Socialite::driver('google')->user();
            
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName() ?? $googleUser->getNickname() ?? 'Google User',
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(Str::random(24)),
                    'role' => 'member',
                    'is_active' => false, // New members require admin verification
                    'email_verified_at' => now(),
                ]);
            }

            Auth::login($user, true);

            if ($user->role === 'member' && !$user->is_active) {
                return redirect()->route('membership.pending');
            }

            return redirect()->intended(route('dashboard'));
        } catch (Exception $e) {
            return redirect()->route('login')->with('status', 'Google authentication failed or was cancelled.');
        }
    }
}
