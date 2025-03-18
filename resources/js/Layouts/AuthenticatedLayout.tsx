import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Player } from '@/Pages/player/player';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { HouseDoor, Person, BoxArrowRight, Film } from 'react-bootstrap-icons';

export default function Authenticated({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <>
            <Player auth={usePage().props.auth} />
            <div className="flex min-h-screen bg-background-500 dark:bg-background-900">
                <aside className="fixed top-0 left-0 h-full bg-background-100 dark:bg-background-800 w-16 flex flex-col items-center p-4 shadow-md">
                    <div className="flex items-center justify-center mb-6">
                        <Link href="/">
                            <ApplicationLogo className="h-10 w-auto fill-current text-text-50" />
                        </Link>
                    </div>
                    <nav className="flex flex-col space-y-2">
                        <Link href={route('dashboard')} className={`flex justify-center text-text-50 hover:bg-accent-900 p-3 rounded ${route().current('dashboard') ? 'bg-accent-900' : ''}`}>
                            <HouseDoor size={24} />
                        </Link>
                        <Link href={route('playlist.index')} className={`flex justify-center text-text-50 hover:bg-accent-900 p-3 rounded ${route().current('playlist.index') ? 'bg-accent-900' : ''}`}>
                            <Film size={24} />
                        </Link>
                        <Link href={route('profile.edit')} className={`flex justify-center text-text-50 hover:bg-accent-900 p-3 rounded ${route().current('profile.edit') ? 'bg-accent-900' : ''}`}>
                            <Person size={24} />
                        </Link>
                        <Link href={route('logout')} method="post" as="button" className="flex justify-center text-text-50 hover:bg-accent-900 p-3 rounded">
                            <BoxArrowRight size={24} />
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col ml-16">
                    <ToastContainer theme={currentTheme} />
                    {header && (
                        <header className="bg-background-100 shadow dark:bg-background-800 p-6">
                            {header}
                        </header>
                    )}
                    <main className="p-6 text-text-900 dark:text-text-50">{children}</main>
                </div>
            </div>
        </>
    );
}
