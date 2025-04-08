<?php

use App\Http\Controllers\ArtistController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\PlaylistSongController;
use App\Http\Controllers\SpotifyController;
use App\Models\SpotifyUserData;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('artists', ArtistController::class);

Route::get('/auth/redirect', function () {
    return Socialite::driver('spotify')->scopes([
        'streaming',
        'user-read-email',
        'user-read-private',
    ])->redirect();
})->middleware('auth')->name('spotify.redirect');

Route::get('/auth/callback', function () {
    $user = Socialite::driver('spotify')->stateless()->user();
    $expiresAt = now()->addSeconds($user->expiresIn);
    SpotifyUserData::updateOrCreate(
        ['user_id' => auth()->id()],
        [
            'spotify_id' => $user->id,
            'spotify_token' => $user->token,
            'spotify_refresh_token' => $user->refreshToken,
            'spotify_expires_at' => $expiresAt
        ]
    );

    return redirect('/dashboard');
})->middleware('auth')->name('spotify.callback');


Route::get('/player', function () {
    // Token nog geldig?
    $accessToken = SpotifyUserData::where('user_id', auth()->id())->first();
    if (!$accessToken) {
        return redirect()->route('spotify.redirect');
    }

    $expiration = $accessToken->spotify_expires_at;

    if (now()->greaterThan($expiration)) {
        $response = (new SpotifyController())->refreshAccessToken($accessToken->spotify_refresh_token);
        dd($response);
    }

    return Inertia::render('player/player');
})->middleware('auth')->name('player');


Route::resource('playlist', PlaylistController::class);
Route::resource('playlistsong',PlaylistSongController::class);
Route::get('playlists/get', [PlaylistController::class, 'getPlaylist'])->name('playlist.get');
Route::post('playlist/{playlist}/edit', [PlaylistController::class, 'update'])->name('playlist.editp');
Route::resource('image', ImageController::class);
require __DIR__ . '/auth.php';
