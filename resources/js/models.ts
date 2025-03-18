import { User } from "./types";

// From here all Laravel models are defined as TS types.
interface Model {
    id: number;
    created_at: string;
    updated_at: string;
}
interface HasSpotifyID {
    spotify_id: string;
}

export interface Genre extends Model, HasSpotifyID { 
    name: string;
}

export interface Artist extends Model, HasSpotifyID {
    name: string;
    image_id: number;
    albums?: Album[];
    image?: Image;
}

export interface Album extends Model, HasSpotifyID {
    title: string;
    artist_id: number;
    artist?: Artist;
    year: number;
    cover_url: string;
}

export interface Image extends Model { 
    s3_url: string;
}

export interface Playlist extends Model {
    user_id: number;
    user?: User;
    name: string;
    image_id: number;
    image?: Image;  
    songs: PlaylistSong[]
}

export interface Song extends Model, HasSpotifyID { 
    title: string;
    artist_id: number;
    artist?: Artist;
    album_id: number;
    album?: Album;
    genre_id: number;
    genre?: Genre;
    duration: number;
    cover_url: string;
}

export interface LikedSong extends Model {
    user_id: number;
    user?: User;
    song_id: number;
    song?: Song;
}

export interface PlaylistSong extends Model {
    playlist_id: number;
    playlist?: Playlist;
    song_id: number;
    song?: Song;
}

export interface SharedPlaylist extends Model {
    user_id: number;
    user?: User;
    playlist_id: number;
    playlist?: Playlist;
} 