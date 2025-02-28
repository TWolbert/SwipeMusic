import Authenticated from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { api } from '@/utils';
import 'https://sdk.scdn.co/spotify-player.js';
import { useEffect, useState } from 'react';
import { PauseFill, PlayFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

// Helper to format ms into mm:ss
const formatMsToMinutesAndSeconds = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function Player({ auth }: PageProps) {
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [isPaused, setPaused] = useState(false);
    const [isActive, setActive] = useState(false);
    const [currentTrack, setTrack] = useState<Spotify.Track | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [volume, setVolume] = useState(0.5);
    const [currentState, setCurrentState] = useState<Spotify.PlaybackState | null>(null);

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
            setCurrentState(state);
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

    // Poll for current playback state every second to update the timeline automatically.
    useEffect(() => {
        if (player) {
            const interval = setInterval(() => {
                player.getCurrentState().then(state => {
                    setCurrentState(state);
                }).catch(err => console.error("Error updating playback state:", err));
            }, 1000); // Poll every second

            return () => clearInterval(interval);
        }
    }, [player]);

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
    };

    // Calculate progress in percentages
    const progressPercentage = currentTrack
        ? ((currentState?.position ?? 0) / currentTrack.duration_ms) * 100
        : 0;

    return (
        <div className="fixed bottom-0 inset-x-0 flex justify-center">
            <div className="bg-white dark:bg-gray-900 shadow-lg w-fit">
                {/* Timeline across the top */}
                <div className="relative h-2 bg-gray-300 dark:bg-gray-700">
                    <div
                        className="absolute top-0 left-0 h-2 bg-blue-600 dark:bg-blue-500 transition-all duration-200"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                {/* Timeline time display (left: current time, right: total time) */}
                {currentTrack ? (
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-4 mt-1">
                        <span>{formatMsToMinutesAndSeconds(currentState?.position ?? 0)}</span>
                        <span>{formatMsToMinutesAndSeconds(currentTrack.duration_ms)}</span>
                    </div>
                )
                :
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-4 mt-1">
                    <span>0:00</span>
                    <span>0:00</span>
                </div>
                }

                {/* Player Controls & Info */}
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Track Info: Album Art + Title/Artist */}
                    <div className="flex items-center min-w-[200px]">
                        {currentTrack?.album?.images?.[0] ? (
                            <img
                                src={currentTrack.album.images[0].url}
                                alt="Album Art"
                                className="w-16 h-16 object-cover rounded mr-4"
                            />
                        )
                        :
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded mr-4" />
                        
                    }
                        <div className=' px-2'>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 min-w-48 max-w-48 w-48 text-ellipsis overflow-hidden text-nowrap">
                                {currentTrack ? currentTrack.name : 'No track playing'}
                            </p>
                            {currentTrack && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 min-w-48 max-w-48 w-48 text-ellipsis overflow-hidden text-nowrap">
                                    {currentTrack.artists.map(artist => artist.name).join(', ')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Control Buttons & Volume */}
                    <div className="flex items-center gap-4">
                        {/* Play/Pause */}
                        <button
                            onClick={handleTogglePlay}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded"
                        >
                            {isPaused ? <PlayFill size={24} /> : <PauseFill size={24}/>}
                        </button>

                        {/* Volume */}
                        <div className="flex flex-col items-center">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Volume: {Math.round(volume * 100)}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-20"
                            />
                        </div>

                        {/* Random Track Button */}
                        <button
                            onClick={getRandomTrack}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white font-semibold rounded"
                        >
                            Play Random Track
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}
