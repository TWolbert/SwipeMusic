import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react";
import { PlayListData } from "@/types";
import axios from "axios";
import { useForm } from "@inertiajs/react";



export default function Playlist({ playlistList }: { playlistList: PlayListData[] }) {
    const [playlists, setPlaylists] = useState<PlayListData[]>(playlistList);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [image, setImage] = useState<string>("")
    const [imageFile, setImageFile] = useState<string>('')

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        image: '' as unknown as File
    });

    useEffect(() => {
        console.log(playlists)
        console.log(dialogOpen)
    }, [playlists, dialogOpen])

    const CreatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.name.trim() === "") return;

        const newPlaylist = {
            name: data.name,
            created_at: new Date().toLocaleDateString(),
            user_id: 0,
            image_id: 0
        };

        post(route('playlist.store'), {
            onSuccess: () => {
                // Reset state
                reset();
                setImage('');
                setImageFile('');
            },
            onError: () => {
                console.log('error')
            }
        });

        setPlaylists([...playlists, newPlaylist]);
        setDialogOpen(false);
    };

    const setImageData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        setData('image', file);
        setImageFile(e.target.value);
    }

    const SharePlaylist = () =>{
        console.log("share")
    }

    const EditPlaylist = () =>{
        setDialogOpen(true)
    }

    return (
        <AuthenticatedLayout header={
            <h2 className="text-xl font-semibold leading-tight text-text-800 dark:text-text-200">
            Playlists
            </h2>
        }>
            <div className="p-6">
            <Dialog>
                <DialogTrigger asChild>
                <button onClick={() => setDialogOpen(true)} className="bg-primary-500 hover:bg-primary-700 rounded-xl text-white p-2 flex items-center gap-2">
                    <i className="bi bi-plus text-2xl"></i> Add Playlist
                </button>
                </DialogTrigger>

                {dialogOpen && (
                <DialogContent className="bg-background-300 text-text-900 p-6 rounded-lg shadow-lg w-60 h-80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed">
                    <h2 className="text-lg font-semibold mb-4">Create Playlist</h2>
                    <form onSubmit={CreatePlaylist} className="flex flex-col gap-2">
                    <label className="font-medium">Playlist Name</label>
                    <input
                        type="text"
                        value={data.name}
                        required
                        onChange={(e) => setData('name', e.target.value)}
                        className="border border-primary-500 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                    <label className="font-medium">Playlist Image</label>
                    <input
                        type="file"
                        value={imageFile as unknown as string}
                        required
                        onChange={setImageData}
                        className="border border-primary-500 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                    {image && <img src={image} alt="Playlist Preview" className="rounded-md mt-2" />}
                    <button type="submit" className="bg-secondary-500 hover:bg-secondary-700 rounded-xl text-white p-2 mt-2">
                        Create
                    </button>
                    </form>
                </DialogContent>
                )}
            </Dialog>
            <div className="mt-4 grid grid-cols-1 gap-4">
                {playlists.map((playlist, index) => (
                <div
                    key={index}
                    className="bg-background-100 text-text-900 p-4 rounded-xl flex justify-between items-center shadow-sm"
                >
                    <div className="p-1">
                    <p className="font-bold">{playlist.name} <i onClick={() => EditPlaylist()} className="bi bi-gear text-accent-500"></i></p>
                    <p className="text-sm text-text-600">Created at {playlist.created_at}</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <i onClick={() => SharePlaylist()} className="bi bi-share text-xl text-accent-500"></i>
                    <img src={`/image/${playlist.image_id}`} alt="Playlist" className="w-12 h-12 bg-background-200 rounded-full" />
                    </div>
                </div>
                ))}
            </div>
            </div>
        </AuthenticatedLayout>

    )
}