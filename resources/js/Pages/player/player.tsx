import Authenticated from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { api } from '@/utils';
import 'https://sdk.scdn.co/spotify-player.js';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Player({ auth }: PageProps) {
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [isPaused, setPaused] = useState(false);
    const [isActive, setActive] = useState(false);
    const [currentTrack, setTrack] = useState<Spotify.Track | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [volume, setVolume] = useState(0.5);

    // Initialize the Spotify Player when the token is available.
    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = auth.user.spotify_user_data?.spotify_token;
        if (!token) {
            console.error('No Spotify token available.');
            return;
        }

        const player = new Spotify.Player({
            name: 'My Web Playback SDK Player',
            getOAuthToken: cb => { cb(token); },
            volume: volume,
        });

        // Handle player events.
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            toast.success('Spotify Player is ready.');
            setDeviceId(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('initialization_error', ({ message }) => {
            console.error('Initialization error:', message);
        });

        player.addListener('authentication_error', ({ message }) => {
            console.error('Authentication error:', message);
        });

        player.addListener('account_error', ({ message }) => {
            console.error('Account error:', message);
        });

        player.addListener('player_state_changed', state => {
            if (!state) {
                setActive(false);
                return;
            }
            setTrack(state.track_window.current_track);
            setPaused(state.paused);
            setActive(!state.paused && state.track_window.current_track !== null);
        });

        // Connect the player.
        player.connect().then(success => {
            if (success) {
                console.log('The Web Playback SDK successfully connected!');
            }
        });

        setPlayer(player);
    };

    // Update volume on change.
    useEffect(() => {
        if (player) {
            player.setVolume(volume).catch(err => console.error(err));
        }
    }, [volume, player]);

    // Toggle play/pause.
    const handleTogglePlay = async () => {
        if (player) {
            const state = await player.getCurrentState();
            if (!state) {
                console.error('User is not playing music through the Web Playback SDK');
                return;
            }
            if (state.paused) {
                player.resume().catch(err => console.error(err));
            } else {
                player.pause().catch(err => console.error(err));
            }
        }
    };

    const playTrack = (trackUri: string) => {
        const token = auth.user.spotify_user_data?.spotify_token;
        if (!token || !deviceId) {
            console.error('Missing Spotify token or device ID.');
            return;
        }

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                uris: [trackUri],
            }),
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to play track:', response.statusText);
                }
            })
            .catch(err => console.error('Error playing track:', err));
    };

    // Handle volume slider changes.
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const getRandomTrack = () => {
        api.get('/spotify/random').then(response => {
            if (response.status === 200) {
                playTrack(response.data.url);
            }
        });
    }

    return (
        <Authenticated header={<h1 className=' dark:text-white'>Player</h1>}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    {currentTrack ? currentTrack.name : 'No track playing'}
                </h2>
                {currentTrack && (
                    <div className="flex items-center gap-4 mb-6">
                        {currentTrack.album.images[0] && (
                            <img
                                src={currentTrack.album.images[0].url}
                                alt="Album Art"
                                className="w-24 h-24 object-cover rounded"
                            />
                        )}
                        <div>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                {currentTrack.artists.map(artist => artist.name).join(', ')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {currentTrack.album.name}
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button
                        onClick={handleTogglePlay}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded"
                    >
                        {isPaused ? 'Play' : 'Pause'}
                    </button>
                    <div className="flex flex-col">
                        <label className="text-gray-700 dark:text-gray-300">
                            Volume: {Math.round(volume * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full"
                        />
                    </div>
                    <button onClick={getRandomTrack} className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white font-semibold rounded">
                        Play Random Track
                    </button>
                </div>
            </div>
        </Authenticated>
    );
}
