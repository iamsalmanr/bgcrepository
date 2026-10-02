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
        Schema::create('scorecards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('player_name');
            $table->string('member_id')->nullable();
            $table->string('competition')->nullable();
            $table->foreignId('tournament_id')->nullable()->constrained('tournaments')->nullOnDelete();
            $table->date('played_at');
            $table->string('tee_type')->default('men'); // 'men' or 'ladies'
            $table->string('round_type')->default('9_holes'); // '9_holes' or '18_holes'
            $table->integer('handicap')->default(0);
            
            // Hole-by-hole scores
            $table->json('scores_r1')->nullable(); // Array of 9 numbers [5,8,5,6,7,5,6,6,5]
            $table->json('scores_r2')->nullable(); // Array of 9 numbers for round 2
            
            $table->integer('gross_r1')->default(0);
            $table->integer('gross_r2')->nullable();
            $table->integer('gross_total')->default(0);
            $table->decimal('net_score', 5, 1)->default(0);
            
            $table->string('marker_name')->nullable();
            $table->string('player_signature')->nullable();
            $table->text('notes')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scorecards');
    }
};
