import { Artist } from "@/models";
import { PageProps } from "@/types";

export default function Index({ auth, artists }: PageProps<{ artists: Artist[] }>) {
    return (
        <div>
            <h1>Artists</h1>
            <ul>
                {artists.map((artist) => (
                    <li key={artist.id}>
                        <a href={`/artists/${artist.id}`}>{artist.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}