<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artist extends Model
{
    protected $fillable = [
        'spotify_id',
        'name',
        'image_id'
    ];

    public function albums()
    {
        return $this->hasMany(Album::class);
    }

    public function image()
    {
        return $this->belongsTo(Image::class);
    }
}
