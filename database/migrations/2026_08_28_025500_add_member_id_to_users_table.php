<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('member_id')->nullable()->unique()->after('id');
        });

        // Backfill existing users with sequential Member IDs
        $users = DB::table('users')->orderBy('id')->get();
        foreach ($users as $user) {
            $memberId = 'BGC-' . date('y') . str_pad($user->id, 4, '0', STR_PAD_LEFT);
            DB::table('users')->where('id', $user->id)->update(['member_id' => $memberId]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('member_id');
        });
    }
};
