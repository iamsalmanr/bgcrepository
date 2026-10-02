<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        
        @php
            $faviconPng = asset('favicon.png') . '?v=20260828';
            $faviconIco = asset('favicon.ico') . '?v=20260828';
        @endphp
        <link rel="icon" type="image/png" sizes="32x32" href="{{ $faviconPng }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ $faviconPng }}">
        <link rel="icon" type="image/x-icon" href="{{ $faviconIco }}">
        <link rel="shortcut icon" href="{{ $faviconIco }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ $faviconPng }}">

        <!-- Local Cached Fonts Preload -->
        <link rel="preload" href="/fonts/anton/anton-regular.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/fonts/hind-siliguri/hind-siliguri-600.ttf" as="font" type="font/ttf" crossorigin>
        <link rel="preload" href="/fonts/hind-siliguri/hind-siliguri-400.ttf" as="font" type="font/ttf" crossorigin>
        <link rel="preload" href="/fonts/noto-sans-bengali/noto-sans-bengali.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/fonts/tiro-bangla/tiro-bangla-bengali-400-normal.woff2" as="font" type="font/woff2" crossorigin>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Cinzel:wght@400;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Nunito+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">


        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
