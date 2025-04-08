import { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function GenreDialog({ handler }: { handler: (param: string) => void }) {
    const [open, setOpen] = useState(false);

    const genres = ["Rock", "Hip-Hop", "Jazz", "Pop", "Classical", "Electronic"];

    const selectGenre = (genre: string) => {
        toast.success(`Selected genre: ${genre}`);
        handler(genre);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-primary-500 hover:bg-primary-700 rounded-xl text-background p-2 flex items-center gap-2">
                    Choose Genre
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
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="absolute top-2 right-2 text-text-100 hover:text-primary-300"
                                >
                                    ✕
                                </button>
                                <h2 className="text-xl font-bold mb-4">Select a Genre</h2>
                                <div className="flex flex-wrap gap-4">
                                    {genres.map((genre) => (
                                        <button
                                            key={genre}
                                            onClick={() => selectGenre(genre)}
                                            className="bg-primary-500 hover:bg-primary-700 text-background font-bold py-2 px-4 rounded"
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </DialogContent>
                    </>
                )}
            </AnimatePresence>
        </Dialog>
    );
}
