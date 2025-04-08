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

        // Verzend een GET verzoek naar de Spotify API om informatie over een track op te halen
        $trackresponse = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
        ])->get("https://api.spotify.com/v1/tracks/{$trackId}");

        // Controleer of het verzoek succesvol was
        if ($trackresponse->failed()) {
            return response()->json(['error' => 'Spotify API request failed'], 500);
        }

        $artistresponse = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
        ])->get("https://api.spotify.com/v1/artists/{$artistId}");

        $albumresponse = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
        ])->get("https://api.spotify.com/v1/albums/{$albumId}");

        $artist = $artistresponse->json();
        $album = $albumresponse->json();
        $track = $trackresponse->json();
       

        $artistDB = Artist::create([
            'spotify_id' => $track['id'],
            'name' => $artist['name'] ?? 'Onbekend',
            'image_url' =>  $artist['images'][0]['url'] ?? null ?? 'onbekend'
        ]);

        $albumDB = Album::create([
            'id' => $album['id'] ?? null,
            'spotify_id' => $track['id'],
            'title' => $album['name'] ?? null,
            'artist_id' => $artistDB->id,
            'year' => substr($album['release_date'] ?? '0000', 0, 4),
            'cover_url' => $album['images'][0]['url'] ?? null,
        ]);

         Song::create([
            'spotify_id' => $track['id'],
            'title' => $track['name'],
            'artist_id' => $artistDB->id,
            'artist_name' => $track['artists'][0]['name'] ?? 'Onbekend',
            'album_id' => $albumDB->id,
            'genre_id' => 'onbekend',
            'album_name' => $track['album']['name'] ?? 'Onbekend',
            'year' => substr($track['album']['release_date'], 0, 4),  // Alleen het jaar
            'duration' => $track['duration_ms'],  // Duur in milliseconden
            'cover_url' => $track['album']['images'][0]['url'] ?? null, // Album cover URL
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
