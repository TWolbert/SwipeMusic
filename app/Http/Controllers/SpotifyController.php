<?php

namespace App\Http\Controllers;

use App\Models\SpotifyUserData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class SpotifyController extends Controller
{
    public function index()
    {

    }

    public function disconnect()
    {
        SpotifyUserData::where('user_id', Auth::id())->delete();
        return redirect('/dashboard');
    }

    /**
     * Display a listing of the resource.
     */
    public function random()
    {
        $accessToken = SpotifyUserData::where('user_id', Auth::id())->value('spotify_token');
        if (!$accessToken) {
            return response()->json(['error' => 'Spotify access token not configured.'], 500);
        }

        // Generate a random letter (a-z) for our search query
        $randomLetter = chr(rand(97, 122)); // ASCII 97 ('a') to 122 ('z')

        // Define the Spotify search endpoint and query parameters
        $endpoint = 'https://api.spotify.com/v1/search';
        $params = [
            'q' => $randomLetter,
            'type' => 'track',
            'limit' => 50,
        ];

        // Make the request using Laravel's HTTP client with the Bearer token
        $response = Http::withToken($accessToken)->get($endpoint, $params);


        // Check if the request failed and return an error response if so
        if ($response->failed()) {
            return response()->json(['error' => 'Spotify API request failed.'], $response->status());
        }

        $data = $response->json();

        // Check if tracks are available in the response
        if (!isset($data['tracks']['items']) || empty($data['tracks']['items'])) {
            return response()->json(['error' => 'No tracks found for the search query.'], 404);
        }

        // Randomly select one track from the list
        $tracks = $data['tracks']['items'];
        $randomTrack = $tracks[array_rand($tracks)];

        // Get the names of the artists
        $artistNames = collect($randomTrack['artists'])->pluck('name')->toArray();
        // Return the track details as JSON
        return response()->json([
            'track' => $randomTrack['name'],
            'artists' => implode(', ', $artistNames),
            'url' => $randomTrack['uri']
        ]);
    }

    public function refreshAccessToken(string $refreshToken): ?array
    {
        $clientId = config('services.spotify.client_id');
        $clientSecret = config('services.spotify.client_secret');

        // Spotify's token endpoint for refreshing tokens.
        $url = 'https://accounts.spotify.com/api/token';

        // Base64 encode clientId and clientSecret.
        $authHeader = base64_encode($clientId . ':' . $clientSecret);

        // Make the POST request.
        $response = Http::asForm()->withHeaders([
            'Authorization' => 'Basic ' . $authHeader,
        ])->post($url, [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refreshToken,
                ]);

        // Check if the request was successful.
        if ($response->successful()) {
            $data = $response->json();

            SpotifyUserData::where('spotify_refresh_token', $refreshToken)
                ->update([
                    'spotify_token' => $data['access_token'],
                    'spotify_expires_at' => now()->addSeconds($data['expires_in']),
                ]);
            return $data;
        }

        // Log or handle the error as needed.
        \Log::error('Spotify token refresh failed: ' . $response->body());
        return null;
    }

    public function randomWithGenre($genre)
    {
        $accessToken = SpotifyUserData::where('user_id', Auth::id())->value('spotify_token');
        if (!$accessToken) {
            return response()->json(['error' => 'Spotify access token not configured.'], 500);
        }

        // Generate a random letter (a-z) for our search query
        $randomLetter = chr(rand(97, 122)); // ASCII 97 ('a') to 122 ('z')

        // Define the Spotify search endpoint and query parameters
        $endpoint = 'https://api.spotify.com/v1/search';
        $params = [
            'q' => "genre:$genre $randomLetter",
            'type' => 'track',
            'limit' => 50,
        ];

        // Make the request using Laravel's HTTP client with the Bearer token
        $response = Http::withToken($accessToken)->get($endpoint, $params);

        // Check if the request failed and return an error response if so
        if ($response->failed()) {
            return response()->json(['error' => 'Spotify API request failed.'], $response->status());
        }

        $data = $response->json();

        // Check if tracks are available in the response
        if (!isset($data['tracks']['items']) || empty($data['tracks']['items'])) {
            return response()->json(['error' => 'No tracks found for the search query.'], 404);
        }

        // Randomly select one track from the list
        $tracks = $data['tracks']['items'];
        $randomTrack = $tracks[array_rand($tracks)];

        // Get the names of the artists
        $artistNames = collect($randomTrack['artists'])->pluck('name')->toArray();
        // Return the track details as JSON
        return response()->json([
            'track' => $randomTrack['name'],
            'artists' => implode(', ', $artistNames),
            'url' => $randomTrack['external_urls']['spotify']
        ]);
    }

    public function getTrackInfo($trackId)
    {
        // Vervang dit met je eigen access token
        $accessToken = SpotifyUserData::where('user_id', Auth::id())->value('spotify_token');
        if (!$accessToken) {
            return response()->json(['error' => 'Spotify access token not configured.'], 500);
        }

        // Verzend een GET verzoek naar de Spotify API om informatie over een track op te halen
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
        ])->get("https://api.spotify.com/v1/tracks/{$trackId}");

        // Controleer of het verzoek succesvol was
        if ($response->failed()) {
            return response()->json(['error' => 'Spotify API request failed'], 500);
        }

        $track = $response->json();

        // Get the artistId and albumId from the track data
        $artistId = $track['artists'][0]['id'] ?? null;
        $albumId = $track['album']['id'] ?? null;
    
        // 2. Haal artiest-informatie op
        $artist = null;
        $artistImageUrl = null;
        if ($artistId) {
            $artistResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
            ])->get("https://api.spotify.com/v1/artists/{$artistId}");
    
            if ($artistResponse->ok()) {
                $artist = $artistResponse->json();
                $artistImageUrl = $artist['images'][0]['url'] ?? null;
            }
        }
    
        // 3. Haal album-informatie op
        $album = null;
        if ($albumId) {
            $albumResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
            ])->get("https://api.spotify.com/v1/albums/{$albumId}");
    
            if ($albumResponse->ok()) {
                $album = $albumResponse->json();
            }
        }
    
        // Haal de gegevens uit de API response
        $track = $response->json();

        // Geef de gegevens terug in een JSON response
        return response()->json([
            'track' => [
                'spotify_id' => $track['id'],
                'title' => $track['name'],
                'artist_id' => $artistId,
                'artist_name' => $track['artists'][0]['name'] ?? 'Onbekend',
                'album_id' => $albumId,
                'album_name' => $track['album']['name'] ?? 'Onbekend',
                'year' => substr($track['album']['release_date'] ?? '', 0, 4),
                'duration' => $track['duration_ms'],
                'cover_url' => $track['album']['images'][0]['url'] ?? null,
            ],
            'artist' => [
                'id' => $artist['id'] ?? null,
                'name' => $artist['name'] ?? null,
                'genres' => $artist['genres'] ?? [],
                'image_url' => $artistImageUrl,
                'popularity' => $artist['popularity'] ?? null,
                'followers' => $artist['followers']['total'] ?? null,
            ],
            'album' => [
                'id' => $album['id'] ?? null,
                'name' => $album['name'] ?? null,
                'release_date' => $album['release_date'] ?? null,
                'total_tracks' => $album['total_tracks'] ?? null,
                'cover_url' => $album['images'][0]['url'] ?? null,
                'label' => $album['label'] ?? null,
                'genres' => $album['genres'] ?? [],
            ]
        ]);
    }
    
   
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
