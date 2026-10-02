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
        Schema::create('golf_news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->nullable()->index();
            $table->string('source_name')->default('Bangladesh Golf');
            $table->string('language', 10)->default('en')->index();
            $table->text('source_url');
            $table->text('image_url')->nullable();
            $table->mediumText('summary')->nullable();
            $table->longText('content')->nullable();
            $table->string('author')->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->string('external_id')->nullable()->index(); // ID or URL hash to prevent duplicates
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('golf_news');
    }
};
