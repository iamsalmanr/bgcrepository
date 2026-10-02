<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Automatically sync Bangladesh golf news every 3 hours
Illuminate\Support\Facades\Schedule::command('news:sync')
    ->everyThreeHours()
    ->withoutOverlapping()
    ->runInBackground();
