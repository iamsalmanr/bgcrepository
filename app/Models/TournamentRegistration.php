<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TournamentRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'tournament_id',
        'user_id',
        'player_name',
        'member_id',
        'email',
        'phone',
        'handicap',
        'category',
        't_shirt_size',
        'status',
        'notes',
        'registered_at',
    ];

    protected $casts = [
        'handicap' => 'integer',
        'registered_at' => 'datetime',
    ];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
