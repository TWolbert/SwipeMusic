import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    spotify_user_data?: SpotifyUserData;
}

export interface SpotifyUserData {
    user_id: number;
    spotify_id: string;
    spotify_token: string;
    spotify_refresh_token: string;
    spotify_token_expires_at: string;
}

export interface PlayListData {
    user_id: number;
    name: string;
    image_id: number;
    created_at: string;
}


export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
