<?php

namespace Database\Seeders;

use App\Models\Scorecard;
use App\Models\Tournament;
use App\Models\TournamentRegistration;
use App\Models\User;
use Illuminate\Database\Seeder;

class ScorecardSeeder extends Seeder
{
    public function run(): void
    {
        $member = User::where('role', 'member')->first() ?? User::first();
        $admin = User::where('role', 'admin')->first();

        // 1. Scorecards
        Scorecard::updateOrCreate(
            ['player_name' => 'Lt Col Kamrul', 'played_at' => '2026-08-26'],
            [
                'user_id' => $member ? $member->id : null,
                'member_id' => $member ? 'BGC-260001' : null,
                'competition' => 'President Cup Golf Tournament 2026',
                'tee_type' => 'men',
                'round_type' => '9_holes',
                'handicap' => 12,
                'scores_r1' => [5, 8, 5, 6, 7, 5, 6, 6, 5],
                'gross_r1' => 53,
                'gross_total' => 53,
                'net_score' => 41.0,
                'marker_name' => 'Lt Col Eshraq',
                'notes' => 'Official Bogura Golf Club 9-Hole Match from paper scorecard.',
            ]
        );

        Scorecard::updateOrCreate(
            ['player_name' => 'Lt Col Eshraq', 'played_at' => '2026-08-26'],
            [
                'user_id' => null,
                'member_id' => null,
                'competition' => 'President Cup Golf Tournament 2026',
                'tee_type' => 'men',
                'round_type' => '9_holes',
                'handicap' => 18,
                'scores_r1' => [7, 10, 5, 7, 11, 4, 8, 4, 7],
                'gross_r1' => 63,
                'gross_total' => 63,
                'net_score' => 45.0,
                'marker_name' => 'Lt Col Kamrul',
                'notes' => 'Tough putting on Hole 5 Bermuda green.',
            ]
        );

        Scorecard::updateOrCreate(
            ['player_name' => 'KO Ashif', 'played_at' => '2026-08-24'],
            [
                'user_id' => null,
                'member_id' => null,
                'competition' => 'Monthly Medal Round',
                'tee_type' => 'men',
                'round_type' => '9_holes',
                'handicap' => 14,
                'scores_r1' => [6, 12, 9, 6, 10, 4, 7, 6, 5],
                'gross_r1' => 65,
                'gross_total' => 65,
                'net_score' => 51.0,
                'marker_name' => 'Lt Col Kamrul',
                'notes' => 'BGC 9-Hole afternoon fixture.',
            ]
        );

        // 2. Tournament Registrations
        $tournaments = Tournament::all();
        if ($tournaments->count() > 0) {
            $t1 = $tournaments->first();

            TournamentRegistration::updateOrCreate(
                ['tournament_id' => $t1->id, 'player_name' => 'Lt Col Kamrul'],
                [
                    'user_id' => $member ? $member->id : null,
                    'member_id' => $member ? 'BGC-260001' : null,
                    'email' => 'kamrul@bgcbd.com',
                    'phone' => '01711223344',
                    'handicap' => 12,
                    'category' => 'Regular Men',
                    't_shirt_size' => 'L',
                    'status' => 'confirmed',
                    'notes' => 'Caddy request: Senior caddy.',
                ]
            );

            TournamentRegistration::updateOrCreate(
                ['tournament_id' => $t1->id, 'player_name' => 'Lt Col Eshraq'],
                [
                    'user_id' => null,
                    'member_id' => null,
                    'email' => 'eshraq@bgcbd.com',
                    'phone' => '01722334455',
                    'handicap' => 18,
                    'category' => 'Regular Men',
                    't_shirt_size' => 'XL',
                    'status' => 'confirmed',
                    'notes' => 'Early morning tee-off preferred.',
                ]
            );

            TournamentRegistration::updateOrCreate(
                ['tournament_id' => $t1->id, 'player_name' => 'Dr. Nadia Sultana'],
                [
                    'user_id' => null,
                    'member_id' => null,
                    'email' => 'nadia@example.com',
                    'phone' => '01733445566',
                    'handicap' => 22,
                    'category' => 'Ladies',
                    't_shirt_size' => 'M',
                    'status' => 'confirmed',
                ]
            );
        }
    }
}
