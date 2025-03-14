import { jsxs, jsx } from "react/jsx-runtime";
function Index({ auth, artists }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Artists" }),
    /* @__PURE__ */ jsx("ul", { children: artists.map((artist) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: `/artists/${artist.id}`, children: artist.name }) }, artist.id)) })
  ] });
}
export {
  Index as default
};
