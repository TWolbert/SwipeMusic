import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { A as ApplicationLogo } from "./ApplicationLogo-xMpxFOcX.js";
import { Player } from "./player-BUe7gFCA.js";
import { usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { HouseDoor, Film, Person, BoxArrowRight } from "react-bootstrap-icons";
function Authenticated({ header, children }) {
  usePage().props.auth.user;
  const currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Player, { auth: usePage().props.auth }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background-500 dark:bg-background-900", children: [
      /* @__PURE__ */ jsxs("aside", { className: "bg-background-100 dark:bg-background-800 w-16 flex flex-col items-center p-4 h-screen shadow-md", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-10 w-auto fill-current text-text-50" }) }) }),
        /* @__PURE__ */ jsxs("nav", { className: "flex flex-col space-y-2", children: [
          /* @__PURE__ */ jsx(Link, { href: route("dashboard"), className: `flex justify-center text-text-50 hover:bg-accent-900 p-3 rounded ${route().current("dashboard") ? "bg-accent-900" : ""}`, children: /* @__PURE__ */ jsx(HouseDoor, { size: 24 }) }),
          /* @__PURE__ */ jsx(Link, { href: route("playlist.index"), className: `flex justify-center text-text-50 hover:bg-accent-900 p-3 rounded ${route().current("playlist.index") ? "bg-accent-900" : ""}`, children: /* @__PURE__ */ jsx(Film, { size: 24 }) }),
          /* @__PURE__ */ jsx(Link, { href: route("profile.edit"), className: `flex justify-center text-text-50 hover:bg-accent-900 p-3 rounded ${route().current("profile.edit") ? "bg-accent-900" : ""}`, children: /* @__PURE__ */ jsx(Person, { size: 24 }) }),
          /* @__PURE__ */ jsx(Link, { href: route("logout"), method: "post", as: "button", className: "flex justify-center text-text-50 hover:bg-accent-900 p-3 rounded", children: /* @__PURE__ */ jsx(BoxArrowRight, { size: 24 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsx(ToastContainer, { theme: currentTheme }),
        header && /* @__PURE__ */ jsx("header", { className: "bg-background-100 shadow dark:bg-background-800 p-6", children: header }),
        /* @__PURE__ */ jsx("main", { className: "p-6 text-text-900 dark:text-text-50", children })
      ] })
    ] })
  ] });
}
export {
  Authenticated as A
};
