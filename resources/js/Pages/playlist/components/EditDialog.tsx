import TextInput from "@/Components/TextInput";
import { PlayListData } from "@/types";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Gear, Plus } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { api, playlistsAtom } from "@/utils";

export default function EditDialog({ playlist }: { playlist: PlayListData }) {
    const { data, setData, post, errors, reset } = useForm({
        name: playlist.name,
        image: null as File | null,
    });

    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [playlistList, setPlaylistList] = useAtom<PlayListData[]>(playlistsAtom);

    useEffect(() => {
        setImage(`image/${playlist.image_id}`);
    }, []);

    const setImageData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        setData("image", file);
        setImageFile(e.target.value);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("playlist.editp", playlist.id), {
            forceFormData: true,
            method: "post",
            onSuccess: () => {
                toast.success("Playlist updated successfully");
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className=" text-accent-500 hover:text-accent-700 rounded-xl text-background p-2 flex items-center gap-2">
                    <Gear />
                </button>
            </DialogTrigger>

            <AnimatePresence>
                {open && (
                    <>
                        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
                        <DialogContent className="fixed inset-0 flex items-center justify-center">
                            <motion.div
                                className="relative bg-background-700 text-text-100 p-6 rounded-lg shadow-lg w-fit h-fit"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Close Button */}
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="absolute top-2 right-2 text-text-100 hover:text-primary-300"
                                >
                                    ✕
                                </button>

                                <form onSubmit={submit} method="PUT" className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="name" className="block text-sm font-medium">
                                            Name
                                        </label>
                                        <TextInput
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className="px-3 py-2 border bg-background-700 rounded border-secondary-300 focus:outline-none focus:ring focus:border-primary-300"
                                        />
                                        {errors.name && (
                                            <div className="text-accent-500 text-xs">{errors.name}</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="image" className="block text-sm font-medium">
                                            Image
                                        </label>
                                        <input
                                            type="file"
                                            id="image"
                                            onChange={setImageData}
                                            className="px-3 py-2 border max-w-96 w-96 rounded border-secondary-300 focus:outline-none focus:ring focus:border-primary-300"
                                        />
                                        {errors.image && (
                                            <div className="text-accent-500 text-xs">{errors.image}</div>
                                        )}
                                        {image && (
                                            <img
                                                src={image}
                                                alt="playlist"
                                                className="mt-2 max-w-40 object-cover max-h-40 mx-auto rounded shadow"
                                            />
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-primary-500 hover:bg-primary-700 text-background font-bold py-2 px-4 rounded"
                                    >
                                        Update
                                    </button>
                                </form>
                            </motion.div>
                        </DialogContent>
                    </>
                )}
            </AnimatePresence>
        </Dialog>
    );
}