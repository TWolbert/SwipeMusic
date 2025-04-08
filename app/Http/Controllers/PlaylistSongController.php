<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlaylistSongRequest;
use App\Http\Requests\UpdatePlaylistSongRequest;
use App\Models\PlaylistSong;
use Illuminate\Support\Facades\Log;

class PlaylistSongController extends Controller
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
    public function store(StorePlaylistSongRequest $request)
    {
        $playlistId = $request->input('playlist_id');
        $songId = $request->input('song_id');

        Log::info("playlist_id: $playlistId, song_id: $songId");

       PlaylistSong::firstOrCreate([
        'playlist_id' => $playlistId,  
        'song_id' => $songId
       ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PlaylistSong $playlistSong)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PlaylistSong $playlistSong)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlaylistSongRequest $request, PlaylistSong $playlistSong)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PlaylistSong $playlistSong)
    {
        //
    }
}
