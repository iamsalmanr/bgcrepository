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
        Schema::create('tournament_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')->constrained('tournaments')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('player_name');
            $table->string('member_id')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->integer('handicap')->default(0);
            $table->string('category')->default('Regular Men'); // 'Regular Men', 'Ladies', 'Junior', 'Senior', 'Veteran', 'Guest'
            $table->string('t_shirt_size')->nullable(); // 'S', 'M', 'L', 'XL', 'XXL'
            $table->string('status')->default('registered'); // 'registered', 'confirmed', 'waitlisted', 'cancelled'
            $table->text('notes')->nullable();
            $table->timestamp('registered_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tournament_registrations');
    }
};
