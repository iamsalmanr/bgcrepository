<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Page::create([
            'title' => 'Membership Applying Procedure',
            'slug' => 'procedure',
            'content' => '<h1>Membership Applying Procedure</h1><p>Here you can write the full procedure for applying to the club.</p><ul><li>Step 1: Download form</li><li>Step 2: Submit with photos</li></ul>',
            'is_published' => true,
        ]);

        \App\Models\Page::create([
            'title' => 'Membership Fees',
            'slug' => 'fees',
            'content' => '<h1>Membership Fees</h1><p>Details about membership fees.</p><table><tr><th>Type</th><th>Fee</th></tr><tr><td>Regular</td><td>$1000</td></tr></table>',
            'is_published' => true,
        ]);
    }
}
