<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateHeroPositionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('hero_slides')->update([
            'image_position' => 'center center',
            'image_position_mobile' => 'center center',
        ]);
    }
}
