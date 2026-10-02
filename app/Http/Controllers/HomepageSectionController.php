<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomepageSectionController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return Inertia::render('Theme/Homepage/Sections', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'home_service_title' => 'nullable|string|max:255',
            'home_service_subtitle' => 'nullable|string|max:255',
            
            'home_service_1_title' => 'nullable|string|max:255',
            'home_service_1_desc' => 'nullable|string|max:500',
            'home_service_1_image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',

            'home_service_2_title' => 'nullable|string|max:255',
            'home_service_2_desc' => 'nullable|string|max:500',
            'home_service_2_image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',

            'home_service_3_title' => 'nullable|string|max:255',
            'home_service_3_desc' => 'nullable|string|max:500',
            'home_service_3_image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',

            'home_service_4_title' => 'nullable|string|max:255',
            'home_service_4_desc' => 'nullable|string|max:500',
            'home_service_4_image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',

            'home_about_badge' => 'nullable|string|max:255',
            'home_about_title' => 'nullable|string|max:255',
            'home_about_text_1' => 'nullable|string|max:1000',
            'home_about_text_2' => 'nullable|string|max:1000',
            'home_about_image_main_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'home_about_image_inset_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        // Process text fields
        $textFields = [
            'home_service_title',
            'home_service_subtitle',
            'home_service_1_title',
            'home_service_1_desc',
            'home_service_2_title',
            'home_service_2_desc',
            'home_service_3_title',
            'home_service_3_desc',
            'home_service_4_title',
            'home_service_4_desc',
            'home_about_badge',
            'home_about_title',
            'home_about_text_1',
            'home_about_text_2',
        ];

        foreach ($textFields as $field) {
            if ($request->has($field)) {
                Setting::updateOrCreate(['key' => $field], ['value' => $request->input($field) ?? '']);
            }
        }

        // Process Image Uploads
        $imageFields = [
            'home_service_1_image_file' => 'home_service_1_image',
            'home_service_2_image_file' => 'home_service_2_image',
            'home_service_3_image_file' => 'home_service_3_image',
            'home_service_4_image_file' => 'home_service_4_image',
            'home_about_image_main_file' => 'home_about_image_main',
            'home_about_image_inset_file' => 'home_about_image_inset',
        ];

        foreach ($imageFields as $fileInput => $settingKey) {
            if ($request->hasFile($fileInput)) {
                $path = $request->file($fileInput)->store('homepage_sections', 'public');
                Setting::updateOrCreate(['key' => $settingKey], ['value' => '/storage/' . $path]);
            }
        }

        return redirect()->back()->with('success', 'Homepage sections & images updated successfully.');
    }
}
