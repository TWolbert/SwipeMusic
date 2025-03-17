import axios from "axios";

export let api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Jotai atoms to store the state persistently
export const playerAtom = atom<Spotify.Player | null>(null);
export const isPausedAtom = atom(false);
export const isActiveAtom = atom(false);
export const currentTrackAtom = atom<Spotify.Track | null>(null);
export const deviceIdAtom = atom<string | null>(null);
export const volumeAtom = atomWithStorage('volume', 0.5);
export const currentStateAtom = atom<Spotify.PlaybackState | null>(null);
export const isReadyAtom = atom(false);