<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    protected $fillable = [
        'spotify_id',
        'title',
        'artist_id',
        'genre_id',
        'year',
        'duration',
        'cover_url',
        'album_id'
    ];
}
