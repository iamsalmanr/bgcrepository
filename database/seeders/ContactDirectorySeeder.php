<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactDirectorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['column' => 1, 'title' => 'Email', 'details' => 'kgcdhaka@hotmail.com, info@kgc-bd.com', 'sort_order' => 1],
            ['column' => 1, 'title' => 'Restaurant', 'details' => 'Contact No: 0173 000 4680, 0173 000 4690', 'sort_order' => 2],
            ['column' => 1, 'title' => 'House Keeping', 'details' => 'Contact No: 0173 000 4672', 'sort_order' => 3],
            ['column' => 1, 'title' => 'Sports Section', 'details' => 'Contact No: 0173 000 4616', 'sort_order' => 4],
            ['column' => 1, 'title' => 'Registration Desk', 'details' => 'Contact No: 0173 000 4608', 'sort_order' => 5],
            ['column' => 1, 'title' => 'Billing Clerk', 'details' => 'Contact No: 0173 000 4610', 'sort_order' => 6],
            ['column' => 1, 'title' => 'Membership Clerk', 'details' => 'Contact No: 0173 000 4613', 'sort_order' => 7],
            ['column' => 1, 'title' => 'Pro Shop', 'details' => 'Contact No: 01750 634 369', 'sort_order' => 8],
            ['column' => 1, 'title' => 'Swimming Pool & Gym', 'details' => 'Contact No: 0173 000 4684', 'sort_order' => 9],
            ['column' => 2, 'title' => 'Telephone Numbers', 'details' => '+88 02 9835105, 9835121, 9835123, 9835126, 9835127', 'sort_order' => 1],
            ['column' => 2, 'title' => 'Army Exchange Number', 'details' => '7790', 'sort_order' => 2],
            ['column' => 2, 'title' => 'Office Reception / Operator', 'details' => '0', 'sort_order' => 3],
            ['column' => 2, 'title' => 'Sports Section', 'details' => '224', 'sort_order' => 4],
            ['column' => 2, 'title' => 'Registration Desk', 'details' => '116', 'sort_order' => 5],
            ['column' => 2, 'title' => 'Billing Clerk', 'details' => '115', 'sort_order' => 6],
            ['column' => 2, 'title' => 'Membership Clerk', 'details' => '109', 'sort_order' => 7],
            ['column' => 2, 'title' => 'Restaurant', 'details' => '126', 'sort_order' => 8],
            ['column' => 2, 'title' => 'Swimming Pool', 'details' => '117', 'sort_order' => 9]
        ];

        foreach ($data as $item) {
            \App\Models\ContactDirectory::create($item);
        }
    }
}
