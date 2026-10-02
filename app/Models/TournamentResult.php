<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TournamentResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sponsored_by',
        'date',
        'file_path',
    ];
}
