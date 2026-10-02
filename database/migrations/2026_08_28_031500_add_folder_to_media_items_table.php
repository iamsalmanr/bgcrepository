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
        Schema::table('media_items', function (Blueprint $table) {
            if (!Schema::hasColumn('media_items', 'folder')) {
                $table->string('folder')->nullable()->default('General')->after('type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media_items', function (Blueprint $table) {
            if (Schema::hasColumn('media_items', 'folder')) {
                $table->dropColumn('folder');
            }
        });
    }
};
