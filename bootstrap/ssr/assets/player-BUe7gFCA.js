import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { b as playerAtom, i as isPausedAtom, c as isActiveAtom, d as currentTrackAtom, e as deviceIdAtom, v as volumeAtom, f as currentStateAtom, g as isReadyAtom, a as api } from "./utils-rbuxJOcK.js";
import "https://sdk.scdn.co/spotify-player.js";
import { PlayFill, PauseFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import "axios";
import "jotai/utils";
const formatMsToMinutesAndSeconds = (ms) => {
  const minutes = Math.floor(ms / 6e4);
  const seconds = Math.floor(ms % 6e4 / 1e3);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
function Player({ auth }) {
  var _a, _b;
  const [player, setPlayer] = useAtom(playerAtom);
  const [isPaused, setPaused] = useAtom(isPausedAtom);
  const [isActive, setActive] = useAtom(isActiveAtom);
  const [currentTrack, setTrack] = useAtom(currentTrackAtom);
  const [deviceId, setDeviceId] = useAtom(deviceIdAtom);
  const [volume, setVolume] = useAtom(volumeAtom);
  const [currentState, setCurrentState] = useAtom(currentStateAtom);
  const [isReady, setReady] = useAtom(isReadyAtom);
  useEffect(() => {
    var _a2;
    if (window.Spotify) {
      const token = (_a2 = auth.user.spotify_user_data) == null ? void 0 : _a2.spotify_token;
      if (!token) {
        console.error("No Spotify token available.");
        return;
      }
      return;
    }
  }, [auth]);
  window.onSpotifyWebPlaybackSDKReady = () => {
    var _a2;
    const token = (_a2 = auth.user.spotify_user_data) == null ? void 0 : _a2.spotify_token;
    if (!token) {
      console.error("No Spotify token available.");
      return;
    }
    const player2 = new Spotify.Player({
      name: "My Web Playback SDK Player",
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume
    });
    player2.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      toast.success("Spotify Player is ready.");
      setReady(true);
      setDeviceId(device_id);
    });
    player2.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
      toast.error("Spotify Player is not ready.");
      setReady(false);
    });
    player2.addListener("initialization_error", ({ message }) => {
      console.error("Initialization error:", message);
    });
    player2.addListener("authentication_error", ({ message }) => {
      console.error("Authentication error:", message);
    });
    player2.addListener("account_error", ({ message }) => {
      console.error("Account error:", message);
    });
    player2.addListener("player_state_changed", (state) => {
      if (!state) {
        setActive(false);
        return;
      }
      setTrack(state.track_window.current_track);
      setPaused(state.paused);
      setActive(!state.paused && state.track_window.current_track !== null);
      setCurrentState(state);
    });
    player2.connect().then((success) => {
      if (success) {
        setVolume(volume);
        console.log("The Web Playback SDK successfully connected!");
      }
    });
    setPlayer(player2);
  };
  useEffect(() => {
    if (player) {
      player.setVolume(volume).catch((err) => console.error(err));
    }
  }, [volume, player]);
  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        player.getCurrentState().then((state) => {
          setCurrentState(state);
        }).catch((err) => console.error("Error updating playback state:", err));
      }, 1e3);
      return () => clearInterval(interval);
    }
  }, [player]);
  const handleTogglePlay = async () => {
    if (player) {
      const state = await player.getCurrentState();
      if (!state) {
        console.error("User is not playing music through the Web Playback SDK");
        return;
      }
      if (state.paused) {
        player.resume().catch((err) => console.error(err));
      } else {
        player.pause().catch((err) => console.error(err));
      }
    }
  };
  const playTrack = (trackUri) => {
    var _a2;
    const token = (_a2 = auth.user.spotify_user_data) == null ? void 0 : _a2.spotify_token;
    if (!token || !deviceId) {
      console.error("Missing Spotify token or device ID.");
      return;
    }
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        uris: [trackUri]
      })
    }).then((response) => {
      if (!response.ok) {
        console.error("Failed to play track:", response.statusText);
      }
    }).catch((err) => console.error("Error playing track:", err));
  };
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };
  const getRandomTrack = () => {
    api.get("/spotify/random").then((response) => {
      if (response.status === 200) {
        playTrack(response.data.url);
      }
    });
  };
  const progressPercentage = currentTrack ? ((currentState == null ? void 0 : currentState.position) ?? 0) / currentTrack.duration_ms * 100 : 0;
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 inset-x-0 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-background-100 dark:bg-background-800 shadow-lg w-fit", children: [
    /* @__PURE__ */ jsx("div", { className: "relative h-2 bg-background-300 dark:bg-background-700", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-0 left-0 h-2 bg-accent-500 dark:bg-accent-400 transition-all duration-200",
        style: { width: `${progressPercentage}%` }
      }
    ) }),
    currentTrack ? /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-text-600 dark:text-text-400 px-4 mt-1", children: [
      /* @__PURE__ */ jsx("span", { children: formatMsToMinutesAndSeconds((currentState == null ? void 0 : currentState.position) ?? 0) }),
      /* @__PURE__ */ jsx("span", { children: formatMsToMinutesAndSeconds(currentTrack.duration_ms) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-text-600 dark:text-text-400 px-4 mt-1", children: [
      /* @__PURE__ */ jsx("span", { children: "0:00" }),
      /* @__PURE__ */ jsx("span", { children: "0:00" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center min-w-[200px]", children: [
        ((_b = (_a = currentTrack == null ? void 0 : currentTrack.album) == null ? void 0 : _a.images) == null ? void 0 : _b[0]) ? /* @__PURE__ */ jsx(
          "img",
          {
            src: currentTrack.album.images[0].url,
            alt: "Album Art",
            className: "w-16 h-16 object-cover rounded mr-4"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-background-300 dark:bg-background-700 rounded mr-4" }),
        /* @__PURE__ */ jsxs("div", { className: "px-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-base font-medium text-text-900 dark:text-text-100 min-w-48 max-w-48 w-48 text-ellipsis overflow-hidden whitespace-nowrap", children: currentTrack ? currentTrack.name : "No track playing" }),
          currentTrack && /* @__PURE__ */ jsx("p", { className: "text-sm text-text-600 dark:text-text-400 min-w-48 max-w-48 w-48 text-ellipsis overflow-hidden whitespace-nowrap", children: currentTrack.artists.map((artist) => artist.name).join(", ") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleTogglePlay,
            className: "px-4 py-2 bg-primary-500 hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-800 text-white font-semibold rounded",
            children: isPaused ? /* @__PURE__ */ jsx(PlayFill, { size: 24 }) : /* @__PURE__ */ jsx(PauseFill, { size: 24 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-sm text-text-700 dark:text-text-300 mb-1", children: [
            "Volume: ",
            Math.round(volume * 100),
            "%"
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "0",
              max: "1",
              step: "0.01",
              value: volume,
              onChange: handleVolumeChange,
              className: "w-20"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: getRandomTrack,
            disabled: !isReady,
            className: "px-4 py-2 bg-secondary-500 hover:bg-secondary-600 dark:bg-secondary-700 dark:hover:bg-secondary-800 text-white font-semibold rounded disabled:opacity-50",
            children: "Play Random Track"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  Player
};
