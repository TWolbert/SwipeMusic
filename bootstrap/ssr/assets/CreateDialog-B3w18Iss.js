import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { T as TextInput } from "./TextInput-DdSnU-L-.js";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogTrigger, DialogOverlay, DialogContent } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Plus } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { p as playlistsAtom } from "./utils-rbuxJOcK.js";
import "axios";
import "jotai/utils";
function CreateDialog() {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    image: null
  });
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [playlistList, setPlaylistList] = useAtom(playlistsAtom);
  const setImageData = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
    setData("image", file);
    setImageFile(e.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("playlist.store"), {
      onSuccess: () => {
        reset();
        toast.success("Playlist created successfully");
        setOpen(false);
      }
    });
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { className: "bg-primary-500 hover:bg-primary-700 rounded-xl text-background p-2 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Plus, {}),
      " Add Playlist"
    ] }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(DialogOverlay, { className: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" }),
      /* @__PURE__ */ jsx(DialogContent, { className: "fixed inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "relative bg-background-700 text-text-100 p-6 rounded-lg shadow-lg w-fit h-fit",
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.2 },
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setOpen(false),
                className: "absolute top-2 right-2 text-text-100 hover:text-primary-300",
                children: "✕"
              }
            ),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-medium", children: "Name" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "text",
                    id: "name",
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    className: "px-3 py-2 border bg-background-700 rounded border-secondary-300 focus:outline-none focus:ring focus:border-primary-300"
                  }
                ),
                errors.name && /* @__PURE__ */ jsx("div", { className: "text-accent-500 text-xs", children: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "image", className: "block text-sm font-medium", children: "Image" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "file",
                    id: "image",
                    onChange: setImageData,
                    className: "px-3 py-2 border max-w-96 w-96 rounded border-secondary-300 focus:outline-none focus:ring focus:border-primary-300"
                  }
                ),
                errors.image && /* @__PURE__ */ jsx("div", { className: "text-accent-500 text-xs", children: errors.image }),
                image && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: image,
                    alt: "playlist",
                    className: "mt-2 max-w-40 object-cover max-h-40 mx-auto rounded shadow"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: "bg-primary-500 hover:bg-primary-700 text-background font-bold py-2 px-4 rounded",
                  children: "Create"
                }
              )
            ] })
          ]
        }
      ) })
    ] }) })
  ] });
}
export {
  CreateDialog as default
};
