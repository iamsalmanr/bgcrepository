<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Tournament;
use App\Models\Notice;
use App\Models\GalleryImage;
use App\Models\ClubForm;
use App\Models\Setting;
use Carbon\Carbon;

class SampleGolfClubSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // 1. Tournaments ('upcoming', 'live', 'completed')
        Tournament::truncate();
        Tournament::create([
            'title' => 'President Cup Golf Tournament 2026',
            'description' => 'The prestigious annual 18-hole championship featuring club members, division commanders, and invited guest golfers with individual handicap categories.',
            'start_date' => Carbon::now()->addDays(14)->toDateString(),
            'end_date' => Carbon::now()->addDays(16)->toDateString(),
            'status' => 'upcoming',
            'location' => 'Bogura Golf Course',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Tournament::create([
            'title' => '11 Infantry Division Championship Trophy',
            'description' => 'Annual stroke play competition for military and civil officers. Tee off begins at 06:30 hrs followed by prize giving ceremony at the main banquet lounge.',
            'start_date' => Carbon::now()->addDays(35)->toDateString(),
            'end_date' => Carbon::now()->addDays(37)->toDateString(),
            'status' => 'upcoming',
            'location' => 'Main 9-Hole Course',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Tournament::create([
            'title' => 'Autumn Corporate Invitational Golf Match',
            'description' => 'A sponsored corporate invitational match designed for business leaders, sports enthusiasts, and club patrons featuring four-ball scramble format.',
            'start_date' => Carbon::now()->addDays(60)->toDateString(),
            'end_date' => Carbon::now()->addDays(61)->toDateString(),
            'status' => 'upcoming',
            'location' => 'Bogura Golf Club',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        Tournament::create([
            'title' => 'Junior & Ladies Amateur Golf Cup',
            'description' => 'Special developmental golf tournament for budding young talents and lady golfers in Bogura region with clinic and training sessions.',
            'start_date' => Carbon::now()->addDays(80)->toDateString(),
            'end_date' => Carbon::now()->addDays(81)->toDateString(),
            'status' => 'upcoming',
            'location' => 'Driving Range & Practice Greens',
            'is_active' => true,
            'sort_order' => 4,
        ]);

        // 2. Notices
        Notice::truncate();
        Notice::create([
            'title' => 'President Cup 2026 Flight Allotment & Reporting Time',
            'content' => "All participating members and invited players are requested to report at the Starter Hut by 06:15 hrs on match day.\n\nHandicap certificates must be verified with the Tournament Secretary by 10 Sep 2026. Dress code: Formal Club Golf Attire.",
            'is_active' => true,
            'show_on_home' => true,
            'created_at' => Carbon::now()->subDays(1),
        ]);

        Notice::create([
            'title' => 'Green Aeration and Course Maintenance Schedule',
            'content' => "Respected Members, please note that Hole 3 and Hole 7 greens will undergo deep aeration and sand topdressing from Tuesday to Thursday. Temporary greens will be in play.\n\nThank you for your cooperation.",
            'is_active' => true,
            'show_on_home' => true,
            'created_at' => Carbon::now()->subDays(3),
        ]);

        Notice::create([
            'title' => 'Annual Membership Card Renewal & Handicap Updation 2026-2027',
            'content' => "Members are cordially requested to renew their annual subscription and collect the updated digital smart membership card from the club secretariat. Please submit two passport size photographs along with the renewal form.",
            'is_active' => true,
            'show_on_home' => true,
            'created_at' => Carbon::now()->subDays(6),
        ]);

        Notice::create([
            'title' => 'Special Dining & Member Banqueting Guidelines',
            'content' => "The Golf Cafe and Executive Lounge are available for private family dinners, corporate lunches, and celebrations with prior reservation. Please contact the Club Steward at least 48 hours in advance.",
            'is_active' => true,
            'show_on_home' => true,
            'created_at' => Carbon::now()->subDays(10),
        ]);

        // 3. Gallery Images (Using real uploaded images from storage/media)
        GalleryImage::truncate();
        $gallerySamples = [
            [
                'title' => 'Championship Fairways & Palm Trees',
                'image_path' => 'media/153nVwLcLDWp0CqcgrCH1VladE07838uZ6wJG5CF.jpg',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Practice Driving Range & Warmup Area',
                'image_path' => 'media/EVxVvlSwbSblXXytkhRlvUhj6ec2nVMApXIYUE7E.jpg',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Clubhouse Executive Member Lounge',
                'image_path' => 'media/7C1Hh02uCvbKxetbT6oAxqRJ7HqaqOIaBSQrmC4M.jpg',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Pristine Bermuda Greens & Water Hazard',
                'image_path' => 'media/fNP5t0h1rrOMVMQsNZvip4RAuOdEv5uMCkDKGJ9A.jpg',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Tournament Ceremony & Trophy Display',
                'image_path' => 'media/grFKpGtUp1MrD3ShswNcrXUIJE7PHr31tAQx1xrH.jpg',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'title' => 'Club Guest Suites & Accommodation',
                'image_path' => 'media/jZUaBGIzOieUFs3xtSerlJfMpnE0A7gcBNqQFP08.jpg',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'title' => 'Sunset View over Bogura Cantonment Fairways',
                'image_path' => 'media/lDHzjn7Wr7h33gdgz1E6S8la0nY09yqUfIr5tdcL.jpg',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'title' => 'Junior Golf Coaching & Academy',
                'image_path' => 'media/zHS9vNUVdtxBZUicWVMmygyL0SEdWDuDzRruZxSM.jpg',
                'order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($gallerySamples as $g) {
            GalleryImage::create($g);
        }

        // 4. Club Forms
        ClubForm::truncate();
        $forms = [
            [
                'title' => 'Permanent Membership Application Form',
                'file_path' => 'forms/1782537738_AbsentyMemberFrom.docx',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Guest Player & Daily Green Fee Entry Form',
                'file_path' => 'forms/1782537738_AbsentyMemberFrom.docx',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Tournament Entry & Handicap Declaration Form',
                'file_path' => 'forms/1782537738_AbsentyMemberFrom.docx',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Caddy & Golf Bag Locker Storage Allotment Form',
                'file_path' => 'forms/1782537738_AbsentyMemberFrom.docx',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Golf Cart Rental & Course Usage Agreement',
                'file_path' => 'forms/1782537738_AbsentyMemberFrom.docx',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'title' => 'Absentee Member Status Application',
                'file_path' => 'forms/1782537738_AbsentyMemberFrom.docx',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($forms as $form) {
            ClubForm::create($form);
        }

        // 5. Update Map URL in settings with a reliable Google Maps Embed URL
        Setting::updateOrCreate(
            ['key' => 'map_url'],
            ['value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14510.983949826353!2d89.37000000000002!3d24.805000000000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc54e7ef63e3fb%3A0x6b8f8883656360c7!2sBogura%20Golf%20Club!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd']
        );

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
