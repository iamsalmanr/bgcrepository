<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\QuickLink;

class QuickLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $links = [
            [
                'title' => "Online Monthly Subscription",
                'button_text' => "Subscription",
                'url' => "#",
                'sort_order' => 1,
            ],
            [
                'title' => "Online Tournament Registration",
                'button_text' => "Registration",
                'url' => "#",
                'sort_order' => 2,
            ],
            [
                'title' => "Online Flight Schedule",
                'button_text' => "Flight Schedule",
                'url' => "#",
                'sort_order' => 3,
            ],
            [
                'title' => "Online Handicap Report",
                'button_text' => "Handicap",
                'url' => "#",
                'sort_order' => 4,
            ],
            [
                'title' => "Update Member's Profile",
                'button_text' => "Update",
                'url' => "#",
                'sort_order' => 5,
            ],
            [
                'title' => "Book Today's Round",
                'button_text' => "Daily Entry",
                'url' => "#",
                'sort_order' => 6,
            ],
        ];

        foreach ($links as $link) {
            QuickLink::create($link);
        }
    }
}
