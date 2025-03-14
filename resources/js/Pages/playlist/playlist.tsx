import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import  { useEffect, useState } from "react";
import { PlayListData } from "@/types";
import axios from "axios";



export default function Playlist() {
    const [playlists, setPlaylists] = useState<PlayListData[]>([]);
    const [playlistName, setPlaylistName] = useState<string>(""); 
    const [dialogOpen,setDialogOpen] = useState<boolean>(false)

    useEffect(() =>{
        console.log(playlists)
        console.log(dialogOpen)
    },[playlists,dialogOpen])

    const CreatePlaylist = (e:React.FormEvent) => {
        e.preventDefault();
        if (playlistName.trim() === "") return;
    
        const newPlaylist = {
          name: playlistName,
          createdAt: new Date().toLocaleDateString(),
          user_id: 0,
          image_id: 0
        };
    
        setPlaylists([...playlists, newPlaylist]);
        setPlaylistName("");
        setDialogOpen(false);
      };


      axios.post('/',playlists)
      .then((response) =>{
        console.log(response)
      })
      .catch((error) =>{
        console.log(error)
      })
    
    return (
        <AuthenticatedLayout>
            <div className="p-6 ">
                <Dialog>
                    <DialogTrigger asChild>
                        
                        <button onClick={() =>setDialogOpen(true)}  className="bg-purple-600 hover:bg-purple-800 rounded-xl text-white p-2 flex items-center gap-2">
                        <i className="bi bi-plus text-2xl" ></i> add playlist
                            
                        </button>
                    </DialogTrigger>
                
                {dialogOpen &&(
                    <DialogContent className="bg-white text-black p-6 rounded-lg shadow-lg w-60 h-80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed ">
                        <h2 className="text-lg font-semibold">make playlist</h2>
                        <form onSubmit={CreatePlaylist}>
                            <label>playlist name</label>
                            <input type="text" value={playlistName} required onChange={(e) => setPlaylistName(e.target.value)} className="border-pink-400 focus:border-pink-400 rounded-xl "></input>



                            <button type="submit" className="bg-purple-600 hover:bg-purple-800 rounded-xl text-white p-2 mt-2">create</button>
                        </form>

                    </DialogContent>
                      )}
                </Dialog>
                <div className="mt-4">
                {playlists.map((playlists,index) =>(
                    <div 
                    key={index}
                    className="bg-white text-black p-4 mt-4 rounded-xl w-[350px] flex justify-between items-center"
                    >
                        <div className="p-1">
                            <p>{playlists.name}</p>
                            <p>created at{}</p> 
                        </div>
                        <div className="ml-auto">
                            <i className="bi bi-share text-xl"></i>                     
                        </div>
                        <div className="w-12 h-12 ml-4 bg-gray-300 rounded-full"></div>
                    </div>
                ))}
                </div>
      </div>
        </AuthenticatedLayout>

    )
}