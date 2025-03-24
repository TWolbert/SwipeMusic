import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { api } from '@/utils';
import { Head, Link } from '@inertiajs/react';
import { Spotify, Trash, TrashFill } from 'react-bootstrap-icons';

export default function Dashboard({ auth }: PageProps) {

    const getRandomTrack = () => {
        api.get('/spotify/random/jazz').then(response => {
            if (response.status === 200) {
                console.log(response.data);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="">
                <div className=' text-text-900 dark:text-text-50'>
                    {!auth.user.spotify_user_data ? (
                        <a href='/auth/redirect'>
                            <button className="px-4 py-2 bg-green-500 rounded">
                                Connect to Spotify
                            </button>
                        </a>
                    ) : (
                        <>
                            <span>
                                Spotify ID: {auth.user.spotify_user_data.spotify_id}
                            </span>
                            <Link href={route('spotify.disconnect')}>
                                <button className="px-4 py-2 bg-red-500 rounded text-white">
                                    Disconnect
                                </button>
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
