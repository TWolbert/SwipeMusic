import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Playlist } from "@/models"
import { useState } from "react";
import axios from "axios";
import { useForm } from "@inertiajs/react";

export default function PlaylistView({ playlist }: { playlist: Playlist }) {
    const [testArray, setTestArray] = useState([{ id: 1, title: "Shape of You", artist: "Ed Sheeran", genre: "Pop", image_id: "shapeofyou.jpg" },
    { id: 2, title: "Blinding Lights", artist: "The Weeknd", genre: "R&B", image_id: "blindinglights.jpg" },
    { id: 3, title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", image_id: "bohemian.jpg" }]);
    console.log("playlist", playlist);

    const { data, setData, post, errors, reset } = useForm({
        album_id: "1R6MIxBiQensgzDlDes0yT",
        album_name: "Je te laisserai des mots",
        artist_id: "7bPs6jf983f0bjRAt1yxDM",
        artist_name: "Patrick Watson",
        cover_url: "https://i.scdn.co/image/ab67616d0000b2738ea92a85c492af8a38750549",
        duration: "160853",
        spotify_id: "44A0o4jA8F2ZF03Zacwlwx",
        title: "Je te laisserai des mots",
        year: "2010",
        genre_id: "1"

    });

    const PlayMusic = () => {
        //zorgt ervoor dat de muziek in de player komt
        //in songs[] zit de spotify_id
    }

    const createSong = (trackId) => {
        post(route('song.store'), {
            onSuccess: (succes) => {
                reset();
                console.log(succes)
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }

    const getTrackInfo = async (trackId) => {
        try {
            const response = await axios.get(`/spotify/track/${trackId}`);
            const { track, album, artist } = response.data;
            console.log(response.data);
            setData({
                album_id: track.album_id,
                album_name: track.album_name,
                artist_id: track.artist_id,
                artist_name: track.artist_name,
                cover_url: track.cover_url,
                duration: track.duration,
                spotify_id: track.spotify_id,
                title: track.title,
                year: track.year,
                genre_id: "1",
            })
        } catch (error) {
            console.error('Error fetching track info:', error);
        }
    };

    return (
        <AuthenticatedLayout header={
            <h2 className="text-xl font-semibold leading-tight text-text-800 dark:text-text-200">
                {playlist.name}
            </h2>
        }>
            <div className="p-1 mb-4">
                <img src={'/image/' + playlist.image_id} alt="Playlist" className="w-24 h-24 bg-background-200 rounded-full" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
                {testArray.map((song, index) =>
                    <div
                        key={index}
                        className="bg-background-100 text-text-900 p-4 rounded-xl flex justify-between items-center shadow-sm"
                        onClick={() => PlayMusic()}
                    >
                        <div className="p-1">
                            <p className="font-bold">{song.title}</p>
                            <p>{song.artist}</p>
                            <p>{song.genre}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src={'/image/' + playlist.image_id} alt="Playlist" className="w-20 h-20 bg-background-200 rounded-full" />  {/*hier moet nog foto van songs */}
                        </div>

                    </div>
                )}
            </div>
            <button onClick={() => getTrackInfo('44A0o4jA8F2ZF03Zacwlwx')}>
                info songs
            </button>

            <button onClick={() => createSong('44A0o4jA8F2ZF03Zacwlwx')}>
                save song
            </button>
        </AuthenticatedLayout>
    )
}