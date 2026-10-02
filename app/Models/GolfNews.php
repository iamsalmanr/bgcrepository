<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GolfNews extends Model
{
    use HasFactory;

    protected $table = 'golf_news';

    protected $fillable = [
        'title',
        'slug',
        'source_name',
        'language',
        'source_url',
        'image_url',
        'summary',
        'content',
        'author',
        'published_at',
        'external_id',
        'is_pinned',
        'is_active',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_pinned' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('is_pinned', 'desc')
                     ->orderBy('published_at', 'desc')
                     ->orderBy('id', 'desc');
    }
}
