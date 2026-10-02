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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->string('country')->nullable();
            $table->string('rank_designation')->nullable();
            $table->string('appointment')->nullable();
            $table->string('profession')->nullable();
            $table->string('organization')->nullable();
            $table->string('profile_picture')->nullable();
            $table->json('addresses')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'mobile', 'country', 'rank_designation', 
                'appointment', 'profession', 'organization', 
                'profile_picture', 'addresses'
            ]);
        });
    }
};
