"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMenuOpen(false);
        router.push("/");
        router.refresh();
    };

    // Don't show navbar on auth pages
    // if (pathname?.startsWith("/login") || pathname?.startsWith("/signup")) {
    //     return null;
    // }

    return (
        <nav className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-light text-slate-800">
                            Wardrobe
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/collection"
                            className={`text-sm font-medium transition-colors ${
                                pathname === "/"
                                    ? "text-slate-900"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            My Collection
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-slate-50">
                                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-slate-700">
                                            {user.email?.[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm text-slate-700">
                                        {user.email}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <svg
                            className="w-6 h-6 text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200">
                        <div className="space-y-3">
                            <Link
                                href="/"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    pathname === "/collection"
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                My Collection
                            </Link>

                            {user ? (
                                <>
                                    <div className="px-3 py-2">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                                <span className="text-base font-medium text-slate-700">
                                                    {user.email?.[0].toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm text-slate-700">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors text-center"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
