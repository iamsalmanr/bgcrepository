<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

\App\Models\Setting::updateOrCreate(['key' => 'logo_path'], ['value' => '/images/bgc-logo.png']);
echo "Updated logo_path to /images/bgc-logo.png\n";
