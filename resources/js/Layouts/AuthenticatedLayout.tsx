import ApplicationLogo from '@/Components/ApplicationLogo';
import { Player } from '@/Pages/player/player';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { HouseDoor, Person, BoxArrowRight, Film } from 'react-bootstrap-icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Authenticated({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navLinks = [
        { href: route('dashboard'), icon: <HouseDoor size={24} />, key: 'dashboard' },
        { href: route('playlist.index'), icon: <Film size={24} />, key: 'playlist.index' },
        { href: route('profile.edit'), icon: <Person size={24} />, key: 'profile.edit' },
        { href: route('logout'), icon: <BoxArrowRight size={24} />, key: 'logout', method: 'post' as const, as: 'button' },
    ];

    return (
        <>
        <Player auth={usePage().props.auth} />
            <div className="flex min-h-screen bg-background-500 min-w-screen dark:bg-background-900">
                {/* Sidebar for larger screens */}
                {!isMobile && (
                    <aside className="fixed top-0 left-0 h-full bg-background-100 dark:bg-background-800 w-16 flex flex-col items-center p-4 shadow-md">
                        <div className="flex items-center justify-center mb-6">
                            <Link href="/">
                                <ApplicationLogo className="h-10 w-auto fill-current text-text-50" />
                            </Link>
                        </div>
                        <nav className="flex flex-col space-y-2">
                            {navLinks.map(({ href, icon, key, method, as }) => (
                                <Link key={key} href={href} method={method} as={as} className={`flex justify-center dark:text-text-50 hover:bg-accent-900 hover:text-text-50 p-3 rounded ${route().current(key) ? 'bg-accent-900 text-text-50' : ''}`}>
                                    {icon}
                                </Link>
                            ))}
                        </nav>
                    </aside>
                )}

                {/* Main Content */}
                <div className={`flex-1 flex flex-col ${!isMobile ? 'ml-16' : ''} pb-16`}>
                    <ToastContainer theme={currentTheme} />
                    {header && (
                        <header className="bg-background-100 shadow dark:bg-background-800 p-6 flex gap-5 items-center">
                            {isMobile && <Link href={route('dashboard')}><ApplicationLogo /></Link>}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="header"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {header}
                                </motion.div>
                            </AnimatePresence>
                        </header>
                    )}
                    <main className="p-6 text-text-900 dark:text-text-50">{children}</main>
                </div>

                {/* Bottom Navigation for Mobile */}
                {isMobile && (
                    <nav className="fixed bottom-0 left-0 w-full bg-background-100 dark:bg-background-800 flex justify-around p-3 shadow-md z-50">
                        {navLinks.map(({ href, icon, key, method, as }) => (
                            <Link key={key} href={href} method={method} as={as} className={`dark:text-text-50 hover:bg-accent-900 hover:text-text-50 p-3 rounded ${route().current(key) ? 'bg-accent-900 text-text-50' : ''}`}>
                                {icon}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </>
    );
}
