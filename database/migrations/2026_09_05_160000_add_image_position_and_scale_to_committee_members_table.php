<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('committee_members', function (Blueprint $table) {
            if (!Schema::hasColumn('committee_members', 'image_position')) {
                $table->string('image_position', 50)->default('50% 50%')->nullable()->after('image_path');
            }
            if (!Schema::hasColumn('committee_members', 'image_scale')) {
                $table->integer('image_scale')->default(100)->nullable()->after('image_position');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('committee_members', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('committee_members', 'image_position')) {
                $columns[] = 'image_position';
            }
            if (Schema::hasColumn('committee_members', 'image_scale')) {
                $columns[] = 'image_scale';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
