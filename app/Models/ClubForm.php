<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClubForm extends Model
{
    protected $fillable = [
        'title',
        'file_path',
        'sort_order',
        'is_active',
    ];
}
