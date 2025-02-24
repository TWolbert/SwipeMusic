<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    protected $fillable = [
        'spotify_id',
        'title',
        'artist_id',
        'year',
        'cover_url'
    ];

    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }
}
