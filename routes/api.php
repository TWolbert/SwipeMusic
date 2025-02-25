<?php

use App\Http\Controllers\ArtistController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SpotifyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/spotify/random', [SpotifyController::class, 'random'])->middleware('web');
Route::get('/spotify/disconnect', [SpotifyController::class, 'disconnect'])->middleware('web')->name('spotify.disconnect');