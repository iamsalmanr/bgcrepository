<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('committees')) {
            Schema::create('committees', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->string('slug')->unique();
                $table->integer('sort_order')->default(0);
                $table->boolean('show_in_navbar')->default(true);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // Seed initial committees from existing committee members and current navbar menu
        $defaultOrder = [
            'Executive Committee' => 1,
            'Tournament Committee' => 2,
            'Development Committee' => 3,
            'Audit & Finance Committee' => 4,
            'Handicap Committee' => 5,
            'Entertainment & Cultural Committee' => 6,
            'Discipline Committee' => 7,
            'Balloting Committee' => 8,
            'Grounds & Rules Committee' => 9,
            'Welfare Fund Management Committee' => 10,
        ];

        // Gather all existing distinct committees from committee_members table
        $existingCommittees = [];
        if (Schema::hasTable('committee_members')) {
            $existingCommittees = DB::table('committee_members')
                ->select('committee')
                ->whereNotNull('committee')
                ->where('committee', '!=', '')
                ->distinct()
                ->pluck('committee')
                ->toArray();
        }

        // Merge with default list
        $allCommittees = array_unique(array_merge(array_keys($defaultOrder), $existingCommittees));

        // Get currently active committee URLs from navbar 'About Us' menu
        $navbarSlugs = [];
        $aboutUsItem = DB::table('menu_items')->where('title', 'About Us')->first();
        if ($aboutUsItem) {
            $children = DB::table('menu_items')->where('parent_id', $aboutUsItem->id)->get();
            foreach ($children as $c) {
                $slug = ltrim($c->url, '/');
                if ($slug && $slug !== '#' && $slug !== 'photo-gallery' && $slug !== 'gallery') {
                    $navbarSlugs[] = $slug;
                }
            }
        }

        $orderIndex = 1;
        foreach ($allCommittees as $commName) {
            $slug = Str::slug($commName);
            if ($commName === 'Audit & Finance Committee') {
                $slug = 'audit-finance-committee';
            } elseif ($commName === 'Entertainment & Cultural Committee') {
                $slug = 'entertainment-cultural-committee';
            }

            // Determine if it was in navbar
            $inNavbar = in_array($slug, $navbarSlugs) || (isset($defaultOrder[$commName]) && $defaultOrder[$commName] <= 6);
            if ($commName === 'Discipline Committee') {
                $inNavbar = false;
            }

            $order = $defaultOrder[$commName] ?? (20 + $orderIndex);

            DB::table('committees')->updateOrInsert(
                ['name' => $commName],
                [
                    'slug' => $slug,
                    'sort_order' => $order,
                    'show_in_navbar' => $inNavbar,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
            $orderIndex++;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committees');
    }
};
