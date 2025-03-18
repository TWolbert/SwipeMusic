import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react";
import { PlayListData } from "@/types";
import axios from "axios";
import { router, useForm } from "@inertiajs/react";
import CreateDialog from "./components/CreateDialog";
import { useAtom } from "jotai";
import { playlistsAtom } from "@/utils";
import EditDialog from "./components/EditDialog";

export default function Playlist({ playlistList }: { playlistList: PlayListData[] }) {
    const [playlists, setPlaylists] = useAtom<PlayListData[]>(playlistsAtom);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [image, setImage] = useState<string>("")
    const [imageFile, setImageFile] = useState<string>('')

    const [dialogEditOpen, setDialogEditOpen] = useState<boolean>(false)
    const [currentEditingPlaylist, setCurrentEditingPlaylist] = useState<PlayListData>({} as PlayListData)
    const [editImage, setEditImage] = useState<string>("")
    const [editImageFile, setEditImageFile] = useState<string>('')

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        image: '' as unknown as File
    });

    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
        name: '',
        image: '' as unknown as File
    });

    useEffect(() => {
        setPlaylists(playlistList)  
    }, [playlistList])

    const CreatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.name.trim() === "") return;

        const newPlaylist = {
            id: Date.now(), // temporary id, change as needed
            name: data.name,
            created_at: new Date().toLocaleDateString(),
            user_id: 0,
            image_id: 0
        };

        post(route('playlist.store'), {
            onSuccess: () => {
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

    const SharePlaylist = () => {
        console.log("share")
    }

    const EditPlaylist = (id: number) => {
        const playlist = playlists.find(playlist => playlist.id === id);
        if (!playlist) return;
        setCurrentEditingPlaylist(playlist);
        // Prepopulate the edit form with current playlist data
        setEditData('name', playlist.name);
        // If you want to show an existing image, set editImage accordingly. Here we assume a URL.
        setEditImage(`/image/${playlist.image_id}`);
        setDialogEditOpen(true);
    }

    const setEditImageData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        setEditData('image', file);
        setEditImageFile(e.target.value);
    };

    const UpdatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();
        if (editData.name.trim() === "") return;
        console.log(editData)

        editPut(route('playlist.update', currentEditingPlaylist.id), {
            onSuccess: () => {
                // update the local state immediately
                setPlaylists(playlists.map(playlist =>
                    playlist.id === currentEditingPlaylist.id
                        ? { ...playlist, name: editData.name }
                        : playlist
                ));
                editReset();
                setEditImage('');
                setEditImageFile('');
                setDialogEditOpen(false);
            },
            onError: (e) => {
                console.log(e)
            }
        });
    };

    const SongInPlaylist = (id:number) =>{
       router.visit(route('playlist.show',{id}))
        console.log({id});
    };

    return (
        <AuthenticatedLayout header={
            <h2 className="text-xl font-semibold leading-tight text-text-800 dark:text-text-200">
                Playlists
            </h2>
        }>
            <div className="p-6">

                <CreateDialog />

                {/* Edit playlist dialog */}
                <Dialog open={dialogEditOpen} onOpenChange={setDialogEditOpen}>
                    {dialogEditOpen && (
                        <DialogContent className="bg-background-300 text-text-900 p-6 rounded-lg shadow-lg w-60 h-80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed">
                            <h2 className="text-lg font-semibold mb-4">Edit Playlist</h2>
                            <form onSubmit={UpdatePlaylist} className="flex flex-col gap-2">
                                <label className="font-medium">Playlist Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    required
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    className="border border-primary-500 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-primary-300"
                                />
                                <label className="font-medium">Playlist Image</label>
                                <input
                                    type="file"
                                    value={editImageFile as unknown as string}
                                    onChange={setEditImageData}
                                    className="border border-primary-500 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-primary-300"
                                />
                                {editImage && <img src={editImage} alt="Playlist Preview" className="rounded-md mt-2" />}
                                <button type="submit" className="bg-secondary-500 hover:bg-secondary-700 rounded-xl text-white p-2 mt-2">
                                    Update
                                </button>
                            </form>
                        </DialogContent>
                    )}
                </Dialog>

                {/* playlists  */}

                <div className="mt-4 grid grid-cols-1 gap-4">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist.id}
                            className="bg-background-100 text-text-900 p-4 rounded-xl flex justify-between items-center shadow-sm"
                            onClick={() => SongInPlaylist(playlist.id)}
                        >
                            <div className="p-1">
                                <div className="font-bold flex items-center gap-2">
                                    {playlist.name}{" "}
                                    <EditDialog playlist={playlist} />
                                </div>
                                <p className="text-sm text-text-600">Created at {playlist.created_at}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <i onClick={(e) =>{e.stopPropagation();  SharePlaylist()}} className="bi bi-share text-xl text-accent-500 cursor-pointer"></i>
                                <img src={`/image/${playlist.image_id}`} alt="Playlist" className="w-12 h-12 bg-background-200 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    )
}