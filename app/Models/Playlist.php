<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'image_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function songs()
    {
        return $this->hasMany(PlaylistSong::class);
    }

    public function image()
    {
        return $this->belongsTo(Image::class);
    }
}
