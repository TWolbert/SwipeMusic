import axios from "axios";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
let api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});
const playerAtom = atom(null);
const isPausedAtom = atom(false);
const isActiveAtom = atom(false);
const currentTrackAtom = atom(null);
const deviceIdAtom = atom(null);
const volumeAtom = atomWithStorage("volume", 0.5);
const currentStateAtom = atom(null);
const isReadyAtom = atom(false);
const playlistsAtom = atom([]);
export {
  api as a,
  playerAtom as b,
  isActiveAtom as c,
  currentTrackAtom as d,
  deviceIdAtom as e,
  currentStateAtom as f,
  isReadyAtom as g,
  isPausedAtom as i,
  playlistsAtom as p,
  volumeAtom as v
};
