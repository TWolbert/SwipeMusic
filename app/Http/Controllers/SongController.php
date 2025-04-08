<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSongRequest;
use App\Http\Requests\UpdateSongRequest;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Genre;
use App\Models\Song;
use App\Models\SpotifyUserData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
        $artistId = $request->input('artist_id');
        $albumId = $track['album']['id'] ?? null;

        $genreNames = $request->input('genre_name') ?? ['geen genre'];  // Array van genre namen
        $genreIds = [];  // Array om genre_id's in op te slaan

        $durationInSeconds = $request->input('duration');
        $hours = floor($durationInSeconds / 3600);
        $minutes = floor(($durationInSeconds % 3600) / 60);
        $seconds = $durationInSeconds % 60;
        
        // Zorg ervoor dat het formaat altijd 2 cijfers heeft (bijv. 01:05:09)
        $formattedDuration = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);

        Log::info("trackid: $trackId, artistid: $artistId");

        // Ensure both trackId and artistId are provided, otherwise return an error
        if (!$trackId || !$artistId) {
            return response()->json(['error' => 'Track ID and Artist ID are required.'], 400);
        }


        foreach ($genreNames as $genreName) {
            // Gebruik firstOrCreate om het genre op te slaan of te ophalen als het al bestaat
            $genreDB = Genre::firstOrCreate(
                ['name' => $genreName],  // Gebruik de naam om te kijken of het genre al bestaat
                ['name' => $genreName, 'spotify_id' => '']   // Als het genre niet bestaat, maak het dan aan met de naam
            );

            // Voeg de genre_id toe aan de array
            $genreIds[] = $genreDB->id;  // Gebruik de ID van het genre
            $firstGenreId = $genreIds[0] ?? 0;
        }

        $artistDB = Artist::firstOrCreate([
            'spotify_id' => $request->input('artist_id'),
            'name' => $request->input('artist_name') ?? 'Onbekend',
            'image_url' => $request->input('image_url') ?? null,
        ]);

        $albumDB = Album::firstOrCreate([
            'spotify_id' => $request->input('album_id'),
            'title' => $request->input('album_name') ?? 'Onbekend',
            'artist_id' => $artistDB->id,
            'year' => substr($request->input('album_release_date'), 0, 4) ?? '0000',
            'cover_url' => $request->input('album_cover_url') ?? null,
        ]);

        Song::firstOrCreate([
            'spotify_id' => $request->input('spotify_id'),
            'title' => $request->input('title'),
            'artist_id' => $artistDB->id,
            //'artist_name' => $request->input('artist_name') ?? 'Onbekend',
            'genre_id' => $firstGenreId,
            //'album_name' => $request->input('album_name') ?? 'Onbekend',
            'year' => $request->input('year') ?? '0000',
            'duration' => $formattedDuration,
            'cover_url' => $request->input('cover_url') ?? null,
            'album_id' => $albumDB->id,
        ]);

       
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
