<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HoleInOne extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'hole_no',
        'date',
    ];
}
