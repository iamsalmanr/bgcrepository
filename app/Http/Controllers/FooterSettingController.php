<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Theme/Footer/Index', [
            // Passing empty array if not present is handled by Inertia sharing site_settings,
            // but we can pass it directly just for this view to be safe.
            // Actually, site_settings is globally shared so we don't strictly need to pass it here.
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'footer_about_us' => 'nullable|string',
            'footer_contact_phone_civil' => 'nullable|string|max:255',
            'footer_contact_phone_army' => 'nullable|string|max:255',
            'footer_contact_email' => 'nullable|string|email|max:255',
            'footer_useful_links' => 'nullable|array',
            'footer_useful_links.*.title' => 'required|string|max:255',
            'footer_useful_links.*.url' => 'required|string|max:255',
            'footer_social_links' => 'nullable|array',
            'footer_social_links.*.platform' => 'required|string|max:255',
            'footer_social_links.*.url' => 'required|string|max:255',
            'footer_payment_methods' => 'nullable|array',
            'footer_payment_methods.*.name' => 'required|string|max:255',
            'footer_copyright' => 'nullable|string|max:255',
        ]);

        // Convert arrays to JSON strings
        if (isset($validated['footer_useful_links'])) {
            $validated['footer_useful_links'] = json_encode($validated['footer_useful_links']);
        }
        
        if (isset($validated['footer_social_links'])) {
            $validated['footer_social_links'] = json_encode($validated['footer_social_links']);
        }

        if (isset($validated['footer_payment_methods'])) {
            $validated['footer_payment_methods'] = json_encode($validated['footer_payment_methods']);
        }

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return redirect()->back()->with('success', 'Footer settings updated successfully.');
    }
}
