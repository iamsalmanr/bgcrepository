<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return Inertia::render('Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|string|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'map_url' => 'nullable|string|max:1000',
            'frontpage_navbar_font' => 'nullable|string|max:100',
            'frontpage_body_font' => 'nullable|string|max:100',
            'frontpage_heading_font' => 'nullable|string|max:100',
            'google_login_enabled' => 'nullable|string|in:0,1',
            'google_client_id' => 'nullable|string|max:500',
            'google_client_secret' => 'nullable|string|max:500',
            'google_redirect_uri' => 'nullable|string|max:500',
            'footer_social_enabled' => 'nullable|string|in:0,1',
            'social_facebook_enabled' => 'nullable|string|in:0,1',
            'social_facebook_url' => 'nullable|string|max:500',
            'social_twitter_enabled' => 'nullable|string|in:0,1',
            'social_twitter_url' => 'nullable|string|max:500',
            'social_instagram_enabled' => 'nullable|string|in:0,1',
            'social_instagram_url' => 'nullable|string|max:500',
            'social_youtube_enabled' => 'nullable|string|in:0,1',
            'social_youtube_url' => 'nullable|string|max:500',
            'social_linkedin_enabled' => 'nullable|string|in:0,1',
            'social_linkedin_url' => 'nullable|string|max:500',
            'social_whatsapp_enabled' => 'nullable|string|in:0,1',
            'social_whatsapp_url' => 'nullable|string|max:500',
        ]);

        foreach ($validated as $key => $value) {
            if ($request->has($key)) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
            }
        }

        if ($request->hasFile('logo')) {
            $request->validate(['logo' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048']);
            $path = $request->file('logo')->store('logos', 'public');
            Setting::updateOrCreate(['key' => 'logo_path'], ['value' => '/storage/' . $path]);
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
