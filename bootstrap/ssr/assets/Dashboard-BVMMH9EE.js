import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DnCh5A2l.js";
import { Head } from "@inertiajs/react";
import { Spotify, TrashFill } from "react-bootstrap-icons";
import "./ApplicationLogo-xMpxFOcX.js";
import "@headlessui/react";
import "react";
import "./player-BplWi4tD.js";
import "axios";
import "https://sdk.scdn.co/spotify-player.js";
import "react-toastify";
function Dashboard({ auth }) {
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200", children: "Dashboard" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
        /* @__PURE__ */ jsxs("div", { className: "py-12", children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900 dark:text-gray-100", children: "You're logged in!" }) }) }),
          auth.user.spotify_user_data ? /* @__PURE__ */ jsx("div", { className: "mt-8 mx-auto max-w-7xl sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center bg-white text-xl font-bold justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Spotify, { className: "w-8 h-8 m-4 text-green-500" }),
              " Spotify connected! (",
              auth.user.spotify_user_data.spotify_id,
              ")"
            ] }),
            /* @__PURE__ */ jsxs("a", { href: route("spotify.disconnect"), className: "flex gap-2 items-center bg-white pr-5 text-xl font-bold", children: [
              /* @__PURE__ */ jsx(TrashFill, { className: "w-8 h-8 m-4 text-red-500" }),
              " Disconnect spotify"
            ] })
          ] }) }) }) : /* @__PURE__ */ jsx("div", { className: "mt-8 mx-auto max-w-7xl sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow sm:rounded-lg", children: /* @__PURE__ */ jsxs("a", { href: route("spotify.redirect"), className: "flex gap-2 items-center bg-white text-xl font-bold", children: [
            /* @__PURE__ */ jsx(Spotify, { className: "w-8 h-8 m-4 text-green-500" }),
            " Connect spotify"
          ] }) }) })
        ] })
      ]
    }
  );
}
export {
  Dashboard as default
};
