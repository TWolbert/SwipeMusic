<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLikedSongsRequest;
use App\Http\Requests\UpdateLikedSongsRequest;
use App\Models\LikedSongs;

class LikedSongsController extends Controller
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
    public function store(StoreLikedSongsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(LikedSongs $likedSongs)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LikedSongs $likedSongs)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLikedSongsRequest $request, LikedSongs $likedSongs)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LikedSongs $likedSongs)
    {
        //
    }
}
