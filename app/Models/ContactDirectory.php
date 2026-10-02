<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactDirectory extends Model
{
    protected $fillable = [
        'column',
        'title',
        'details',
        'sort_order',
    ];
}
