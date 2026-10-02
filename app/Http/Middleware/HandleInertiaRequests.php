<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = \App\Models\Setting::whereNotIn('key', ['google_client_secret'])->pluck('value', 'key')->toArray();
        $menus = \App\Models\Menu::whereNotNull('location')->with('items')->get()->keyBy('location');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'impersonator' => $request->session()->has('impersonator_id')
                    ? \App\Models\User::find($request->session()->get('impersonator_id'))
                    : null,
            ],
            'site_settings' => $settings,
            'menus' => $menus,
        ];
    }
}
