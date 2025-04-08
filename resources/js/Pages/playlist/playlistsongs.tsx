import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Playlist } from "@/models"
import { useState } from "react";
import axios from "axios";
import { useForm } from "@inertiajs/react";

export default function PlaylistView({ playlist }: { playlist: Playlist }) {
    console.log("playlist", playlist);
    console.log("playlist songs",playlist.songs)


    const PlayMusic = () => {
        //zorgt ervoor dat de muziek in de player komt
        //in songs[] zit de spotify_id
    }

   
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
                {playlist.songs.map((playlistSong, index) =>
                    <div
                        key={index}
                        className="bg-background-100 text-text-900 p-4 rounded-xl flex justify-between items-center shadow-sm"
                        onClick={() => PlayMusic()}
                    >
                        <div className="p-1">
                            <p className="font-bold"> {playlistSong.song?.title || "niet beschikbaar"}</p>
                            <p> {playlistSong.song?.artist?.name || "niet beschikbaar"}</p>
                            <p> {playlistSong.song?.genre?.name || "niet beschikbaar"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <img src={'/image/' + playlist.image_id} alt="track cover" className="w-20 h-20 bg-background-200 rounded-full" />  hier moet nog foto van songs */}
                            <img src={playlistSong.song?.cover_url} alt="track cover" className="w-20 h-20 bg-background-200 rounded-full" />
                        </div>

                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}