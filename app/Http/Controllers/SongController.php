<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSongRequest;
use App\Http\Requests\UpdateSongRequest;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Song;
use App\Models\SpotifyUserData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class SongController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSongRequest $request)
    {
        $accessToken = SpotifyUserData::where('user_id', Auth::id())->value('spotify_token');
        if (!$accessToken) {
            return response()->json(['error' => 'Spotify access token not configured.'], 500);
        }

        $trackId = $request->input('spotify_id'); 
        // $artistId = $request->input('artist_id'); 
        $artistId = $track['artists'][0]['id'] ?? null ?? $request->input('artist_id');
        $albumId = $track['album']['id'] ?? null;

        // Ensure both trackId and artistId are provided, otherwise return an error
        if (!$trackId || !$artistId) {
            return response()->json(['error' => 'Track ID and Artist ID are required.'], 400);
        }

        $artistDB = Artist::create([
            'spotify_id' => $request->input('artist_id'),
            'name' => $request->input('artist_name') ?? 'Onbekend',
            'image_url' => $request->input('image_url') ?? null,
        ]);
        
        $albumDB = Album::create([
            'spotify_id' => $request->input('album_id'),
            'title' => $request->input('album_name') ?? 'Onbekend',
            'artist_id' => $artistDB->id,
            'year' => $request->input('album_release_date') ?? '0000',
            'cover_url' => $request->input('cover_url') ?? null,
        ]);
        
        Song::create([
            'spotify_id' => $request->input('spotify_id'),
            'title' => $request->input('title'),
            'artist_id' => $artistDB->id,
            'artist_name' => $request->input('artist_name') ?? 'Onbekend',
            'album_id' => $albumDB->id,
            'album_name' => $request->input('album_name') ?? 'Onbekend',
            'genre_id' => $request->input('genre_id') ?? 'onbekend',
            'year' => $request->input('year') ?? '0000',
            'duration' => $request->input('duration'),
            'cover_url' => $request->input('cover_url') ?? null,
        ]);

            return response()->json($albumDB);

       

    }

    /**
     * Display the specified resource.
     */
    public function show(Song $song)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Song $song)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSongRequest $request, Song $song)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Song $song)
    {
        //
    }
}
