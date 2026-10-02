<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scorecard extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'player_name',
        'member_id',
        'competition',
        'tournament_id',
        'played_at',
        'tee_type',
        'round_type',
        'handicap',
        'scores_r1',
        'scores_r2',
        'gross_r1',
        'gross_r2',
        'gross_total',
        'net_score',
        'status',
        'marker_name',
        'player_signature',
        'notes',
        'created_by',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'played_at' => 'date',
        'approved_at' => 'datetime',
        'scores_r1' => 'array',
        'scores_r2' => 'array',
        'handicap' => 'integer',
        'gross_r1' => 'integer',
        'gross_r2' => 'integer',
        'gross_total' => 'integer',
        'net_score' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
