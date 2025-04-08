import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { api, currentTrackAtom } from '@/utils';
import { PauseFill, PlayFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useForm } from "@inertiajs/react";
import SpotifyWebPlayer from 'react-spotify-web-playback';
import PrimaryButton from '@/Components/PrimaryButton';
import GenreDialog from './components/GenreDialog';

// Helper to format ms into mm:ss
const formatMsToMinutesAndSeconds = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function Player({ auth }: { auth: PageProps['auth'] }) {
    // We keep the track info atom so that the rest of the UI displays current track details.
    const [currentTrack, setTrack] = useAtom(currentTrackAtom);

    // Local state for the react-spotify-web-playback component.
    const [play, setPlay] = useState(false);
    const [uris, setUris] = useState<string[]>([]);

    // Other UI states (playlist dropdown etc).
    const [showDropDown, setShowDropDown] = useState(false);
    const [playlist, setPlaylist] = useState<any[]>([]);
    const [playlistId, setPlaylistId] = useState<number | undefined>(undefined);
    const [songId, setSongId] = useState<number | undefined>(undefined);

    const { data, setData, post, processing, errors, reset } = useForm({
        playlist_id: '',
        song_id: ''
    });

    // Toggle dropdown
    const toggleDropdown = () => {
        setShowDropDown(!showDropDown);
    };

    useEffect(() => {
        setPlay(true);
     }, [uris]);

    // Add to playlist
    const addToPlaylist = (id: number) => {
        setPlaylistId(id);
        console.log("playlistId", id);
        // You can: post(route('playlistsong.store'), { playlist_id: id, song_id: songId })
    };

    const loadPlaylists = async () => {
        try {
            const response = await axios.get(route('playlist.get'));
            setPlaylist(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadPlaylists();
    }, []);

    // Toggle play/pause. The custom button simply toggles our play state.
    const handleTogglePlay = () => {
        setPlay(!play);
    };

    // Instead of using the player SDK’s API, getRandomTrack now updates the uris array.
    const getRandomTrack = () => {
        api.get('/spotify/random').then(response => {
            if (response.status === 200) {
                console.log(response.data);
                // Expecting response.data.url to be a valid Spotify track URI (e.g. "spotify:track:...")
                setUris([response.data.url]);
            }
        });
    };

    const getRandomTrackByGenre = (genre: string) => {
        api.get(`/spotify/random/${genre}`).then(response => {
            if (response.status === 200) {
                setUris([response.data.url]);
            }
        });
    };

    // The progress timeline and time display below is based on the currentTrack state.
    // With react-spotify-web-playback you can extract track details in the callback.
    // Here we assume that the SpotifyWebPlayer callback returns a state with isPlaying and track information.
    // (You may need to adjust the callback if the returned object shape changes.)
    const handlePlayerCallback = (state: any) => {
        if (!state) return;
        if (!state.isPlaying) {
            setPlay(false);
        }
        if (state.track) {
            setTrack(state.track);
        }
    };

    // Calculate progressPercentage if currentTrack is available.
    // Note: React Spotify Web Playback currently doesn’t provide playback position,
    // so this calculation is only valid if you update it from the callback.
    // Otherwise, you may wish to remove the timeline.
    const progressPercentage = currentTrack && currentTrack.duration_ms
        ? // Without real-time tracking, this remains static.
        0
        : 0;

    return (
        <div className="fixed bottom-0 inset-x-0 flex justify-center w-full">
            <div className='w-full ml-16'>
                <SpotifyWebPlayer
                    token={auth.user.spotify_user_data?.spotify_token || ''}
                    uris={uris}
                    play={play}
                    callback={handlePlayerCallback}
                    autoPlay={true}
                    components={{
                        leftButton: <GenreDialog handler={getRandomTrackByGenre} />,
                    }}
                    styles={{
                        activeColor: '#888877',
                        bgColor: '#9c638f',
                        color: '#f3f3f1',
                        sliderColor: '#ff007b',
                        trackArtistColor: '#1b1b18',
                        trackNameColor: '#f3f3f1',
                    }}
                />
            </div>
            {/* Spotify Web Playback Component */}

        </div>
    );
}
