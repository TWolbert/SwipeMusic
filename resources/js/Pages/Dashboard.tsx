import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Spotify, Trash, TrashFill } from 'react-bootstrap-icons';

export default function Dashboard({ auth }: PageProps) {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div>
                    </div>
                </div>
                {auth.user.spotify_user_data ? <div className="mt-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-background-500 shadow sm:rounded-lg">
                        <div className="flex gap-2 items-center bg-background-500 text-xl text-text-100 font-bold justify-between">
                            <div className="flex items-center gap-2">
                                <Spotify className="w-8 h-8 m-4 text-text-100" /> Spotify connected! ({auth.user.spotify_user_data.spotify_id})
                            </div>
                            <a href={route('spotify.disconnect')} className="flex gap-2 items-center bg-background-500 pr-5 text-xl text-text-100 font-bold">
                                <TrashFill className="w-8 h-8 m-4 text-text" /> Disconnect spotify
                            </a>
                        </div>
                    </div>
                </div> :
                    <div className="mt-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-background-500 shadow sm:rounded-lg">
                            <a href={route('spotify.redirect')} className='flex gap-2 items-center bg-background-500 text-xl text-text-100 font-bold'>
                                <Spotify className="w-8 h-8 m-4 text-green-500" /> Connect spotify
                            </a>
                        </div>
                    </div>}
            </div>
        </AuthenticatedLayout>
    );
}
