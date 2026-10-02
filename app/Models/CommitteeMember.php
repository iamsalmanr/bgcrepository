<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommitteeMember extends Model
{
    protected $fillable = [
        'name',
        'committee',
        'designation',
        'image_path',
        'image_position',
        'image_scale',
        'sort_order',
        'user_id'
    ];

    protected $casts = [
        'image_scale' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
