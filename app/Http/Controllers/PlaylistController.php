<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlaylistRequest;
use App\Http\Requests\UpdatePlaylistRequest;
use App\Models\Image;
use App\Models\Playlist;
use Inertia\Inertia;
use Storage;

class PlaylistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('playlist/playlist', [
            'playlistList' => Playlist::where('user_id', auth()->id())->get()
        ]);
    }

    public function getPlaylist()
    {
        $playlists = Playlist::where('user_id', auth()->id())->get();

        return response()->json($playlists);
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
    public function store(StorePlaylistRequest $request)
    {
        // Get file from request
        $file = $request->file('image');

        $randomName = uniqid() . '-' . $file->getClientOriginalName() . '.' . $file->getClientOriginalExtension();

        // Upload to s3
        Storage::disk('s3')->put('playlist/' . $randomName, $file->get());

        $image = Image::create([
            's3_url' => "playlist/{$randomName}"
        ]);

        Playlist::create([
            'user_id' => auth()->id(),
            'name' => $request->validated('name'),
            'image_id' => $image->id
        ]);

        return redirect()->route('playlist.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Playlist $playlist)
    {
        $playlist->load(['user', 'songs']);

        return Inertia::render('playlist/playlistsongs', [
            'playlist' => $playlist
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Playlist $playlist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlaylistRequest $request, Playlist $playlist)
    {
        $file = $request->file('image');

        $randomName = uniqid(). '-' . $file->getClientOriginalName() . '.' . $file->getClientOriginalExtension();

        // Upload to s3
        Storage::disk('s3')->put('playlist/' . $randomName, $file->get());

        $image = Image::create([
            's3_url' => "playlist/{$randomName}"
        ]);

        $playlist->update([
            'name' => $request->validated('name'),
            'image_id' => $image->id
        ]);

        return redirect()->route('playlist.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Playlist $playlist)
    {
        //
    }
}
