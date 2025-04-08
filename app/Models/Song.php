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

    // Relatie met de artiest
    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    // Relatie met het album
    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    // Relatie met het genre
    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }
}
