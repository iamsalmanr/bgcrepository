<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaItem extends Model
{
    protected $fillable = [
        'name',
        'file_path',
        'mime_type',
        'size',
        'type',
        'folder',
        'tournament_id'
    ];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }
}
