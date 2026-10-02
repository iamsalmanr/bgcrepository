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
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->string('image_position_mobile', 50)->default('50% 50%')->nullable()->after('text_position');
            $table->string('text_position_mobile', 50)->default('50% 50%')->nullable()->after('image_position_mobile');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropColumn(['image_position_mobile', 'text_position_mobile']);
        });
    }
};
