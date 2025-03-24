import { jsx, jsxs } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-BG7wCNvD.js";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import CreateDialog from "./CreateDialog-B3w18Iss.js";
import { useAtom } from "jotai";
import { p as playlistsAtom } from "./utils-rbuxJOcK.js";
import EditDialog from "./EditDialog-Dpd7ItnS.js";
import "./ApplicationLogo-xMpxFOcX.js";
import "./player-BUe7gFCA.js";
import "https://sdk.scdn.co/spotify-player.js";
import "react-bootstrap-icons";
import "react-toastify";
import "./TextInput-DdSnU-L-.js";
import "framer-motion";
import "axios";
import "jotai/utils";
function Playlist({ playlistList }) {
  const [playlists, setPlaylists] = useAtom(playlistsAtom);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [currentEditingPlaylist, setCurrentEditingPlaylist] = useState({});
  const [editImage, setEditImage] = useState("");
  const [editImageFile, setEditImageFile] = useState("");
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    image: ""
  });
  const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
    name: "",
    image: ""
  });
  useEffect(() => {
    setPlaylists(playlistList);
  }, [playlistList]);
  const SharePlaylist = () => {
    console.log("share");
  };
  const setEditImageData = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImage(reader.result);
    };
    reader.readAsDataURL(file);
    setEditData("image", file);
    setEditImageFile(e.target.value);
  };
  const UpdatePlaylist = (e) => {
    e.preventDefault();
    if (editData.name.trim() === "") return;
    console.log(editData);
    editPut(route("playlist.update", currentEditingPlaylist.id), {
      onSuccess: () => {
        setPlaylists(playlists.map(
          (playlist) => playlist.id === currentEditingPlaylist.id ? { ...playlist, name: editData.name } : playlist
        ));
        editReset();
        setEditImage("");
        setEditImageFile("");
        setDialogEditOpen(false);
      },
      onError: (e2) => {
        console.log(e2);
      }
    });
  };
  return /* @__PURE__ */ jsx(Authenticated, { header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-text-800 dark:text-text-200", children: "Playlists" }), children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx(CreateDialog, {}),
    /* @__PURE__ */ jsx(Dialog, { open: dialogEditOpen, onOpenChange: setDialogEditOpen, children: dialogEditOpen && /* @__PURE__ */ jsxs(DialogContent, { className: "bg-background-300 text-text-900 p-6 rounded-lg shadow-lg w-60 h-80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Edit Playlist" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: UpdatePlaylist, className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "font-medium", children: "Playlist Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: editData.name,
            required: true,
            onChange: (e) => setEditData("name", e.target.value),
            className: "border border-primary-500 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-primary-300"
          }
        ),
        /* @__PURE__ */ jsx("label", { className: "font-medium", children: "Playlist Image" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            value: editImageFile,
            onChange: setEditImageData,
            className: "border border-primary-500 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-primary-300"
          }
        ),
        editImage && /* @__PURE__ */ jsx("img", { src: editImage, alt: "Playlist Preview", className: "rounded-md mt-2" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "bg-secondary-500 hover:bg-secondary-700 rounded-xl text-white p-2 mt-2", children: "Update" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-1 gap-4", children: playlists.map((playlist) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-background-100 text-text-900 p-4 rounded-xl flex justify-between items-center shadow-sm",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "font-bold flex items-center gap-2", children: [
              playlist.name,
              " ",
              /* @__PURE__ */ jsx(EditDialog, { playlist })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-600", children: [
              "Created at ",
              playlist.created_at
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("i", { onClick: () => SharePlaylist(), className: "bi bi-share text-xl text-accent-500 cursor-pointer" }),
            /* @__PURE__ */ jsx("img", { src: `/image/${playlist.image_id}`, alt: "Playlist", className: "w-12 h-12 bg-background-200 rounded-full" })
          ] })
        ]
      },
      playlist.id
    )) })
  ] }) });
}
export {
  Playlist as default
};
