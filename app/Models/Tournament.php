<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'status',
        'location',
        'link',
        'image_path',
        'is_active',
        'sort_order',
    ];
    
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function registrations()
    {
        return $this->hasMany(TournamentRegistration::class)->orderBy('registered_at', 'desc');
    }
}
