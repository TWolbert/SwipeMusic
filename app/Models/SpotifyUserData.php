<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpotifyUserData extends Model
{
    protected $fillable = [
        'user_id',
        'spotify_id',
        'spotify_token',
        'spotify_refresh_token',
        'spotify_expires_at',
    ];
}
