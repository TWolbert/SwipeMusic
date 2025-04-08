import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { api, currentTrackAtom } from '@/utils';
import { Icon1Circle, PauseFill, PlayFill, Plus } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useForm } from "@inertiajs/react";
import SpotifyWebPlayer from 'react-spotify-web-playback';
import PrimaryButton from '@/Components/PrimaryButton';

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
    const [playlistId, setPlaylistId] = useState<any>();
    const [trackData,setTrackData] = useState<any>();
    const [readyToPost, setReadyToPost] = useState(false);


    const { data, setData, post, processing, errors, reset } = useForm({
        album_id: "",
        album_name: "",
        album_release_date:"",
        album_cover_url:"",
        artist_id: "",
        artist_name: " ",
        image_url: " ",
        cover_url: "",
        duration: "",
        spotify_id: "",
        title: "",
        year: "",
        genre_id: "",
        genre_name:[],
      
    });

    // Toggle dropdown
    const toggleDropdown = () => {
        setShowDropDown(!showDropDown);
    };

    useEffect(() => {
        setPlay(true);
    }, [uris]);

    // Add to playlist
    const addData = (currentPlaylistId: number) => {
        console.log("playlistId", playlistId);

        if (!trackData) {
            toast.error("Geen track geladen.");
            return;
        }
        const songId = trackData.url.split('/track/')[1];

    setData({
        album_id: trackData.album_id,
        album_name: trackData.album_title,
        album_release_date: trackData.album_release_date,
        album_cover_url: trackData.album_cover_url,
        artist_id: trackData.artist_id,
        artist_name: trackData.artist_name,
        image_url: trackData.artist_image_url,
        cover_url: trackData.track_cover_url,
        duration: trackData.track_duration,
        spotify_id: trackData.url.split('/track/')[1],
        title: trackData.track_title,
        year: trackData.track_year,
        genre_id: trackData.genre_id[0] ?? 'onbekend',
        genre_name: trackData.genre_name,
       
    });

    setPlaylistId(currentPlaylistId);
    setReadyToPost(true); // trigger effect

    // createSong();
    // addToPlaylist(playlistId);
        // You can: post(route('playlistsong.store'), { playlist_id: id, song_id: songId })
    };

    useEffect(() => {
        if (!readyToPost || !trackData || !playlistId) return;
    
        const songId = trackData.url.split('/track/')[1];
    
        post(route('song.store'), {
            onSuccess: () => {
                toast.success('Track succesvol opgeslagen!');
                reset();
    
                axios.post(route('playlistsong.store'), {
                    playlist_id: playlistId,
                    song_id: songId,
                }).then(() => {
                    toast.success("Toegevoegd aan playlist!");
                    setReadyToPost(false); // reset trigger
                }).catch((error) => {
                    console.error(error);
                    toast.error('Fout bij toevoegen aan playlist.');
                    setReadyToPost(false);
                });
            },
            onError: (error) => {
                console.error(error);
                toast.error('Er ging iets mis bij het opslaan.');
                setReadyToPost(false);
            }
        });
    }, [readyToPost]);
    
    
    // const createSong = () => {
    //     post(route('song.store'), {
    //         onSuccess: () => {
    //             reset();
    //             toast.success('Track succesvol opgeslagen!');
    //         },
    //         onError: (error) => {
    //             console.error(error);
    //             toast.error('Er ging iets mis bij het opslaan.');
    //         }
    //     });
    // };

    // const addToPlaylist = (playlistId: number) => {
    //     const songId = trackData.url.split('/track/')[1];

    //     if (!playlistId || !songId) {
    //         toast.error('Playlist ID or Song ID is missing.');
    //         return;
    //     }


    //   axios.post(route('playlistsong.store'),{
    //     playlist_id: playlistId,
    //     song_id: songId,
    //         onSuccess: () => {
    //             reset();
    //         },
    //         onError: (error) => {
    //             console.error(error);
    //             toast.error('Er ging iets mis bij het opslaan in de playlist.');
    //         }
    //     })
    // }

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
        console.log("trackdata",trackData)
        console.log("currentplaylistId",playlistId)
    }, [trackData]);

    // Toggle play/pause. The custom button simply toggles our play state.
    const handleTogglePlay = () => {
        setPlay(!play);
    };

    // Instead of using the player SDK’s API, getRandomTrack now updates the uris array.
    const getRandomTrack = () => {
        api.get('/spotify/random').then(response => {
            if (response.status === 200) {
                console.log(response.data);
                const track = response.data;
                setTrackData(track);
                // Expecting response.data.url to be a valid Spotify track URI (e.g. "spotify:track:...")
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
                        leftButton: <PrimaryButton onClick={() => getRandomTrack()}>Get random track</PrimaryButton>,
                        rightButton: (
                            <div className="flex items-center space-x-2">
                                <button onClick={toggleDropdown} className="p-2 bg-gray-800 rounded-full">
                                    <Plus color="white" />
                                </button>
                            </div>
                        )
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

            {/* Dropdown Menu - Outside the Player */}
            {showDropDown && (
                <div className="absolute bottom-[90px] inset-x-0 flex justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg border w-64 p-2 space-y-2">
                    {playlist.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => addData(item.id)}
                            className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 hover:bg-purple-200 transition-all"
                        >
                            Add to <span className="font-semibold">{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>
            )}

        </div>

    );
}
