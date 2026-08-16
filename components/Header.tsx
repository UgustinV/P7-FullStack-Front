"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/components/MenuItem";
import { getInitials } from "@/app/lib/utils";

export function Header({ name }: { name?: string }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMenuOpen(false)
    }, [pathname])

    return (
        <header className="h-20 md:h-24 flex items-center px-4 sm:px-8 lg:px-25 shadow-lg/3 relative">
            <nav className="flex items-center justify-between w-full">
                <Image
                    src="/logo.svg"
                    alt="Logo de haut de page"
                    width={150}
                    height={19}
                    className="w-28 h-auto md:w-37.5 md:h-4.75"
                />

                <div className="hidden md:flex items-center gap-4">
                    <MenuItem href="/dashboard" logo="/dashboard.svg" text="Tableau de bord" alt="Icone de tableau de bord" isActive={pathname === "/dashboard"} />
                    <MenuItem href="/projects" logo="/projects.svg" text="Projets" alt="Icone de dossier" isActive={pathname.startsWith("/projects")} />
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/account" className="shrink-0">
                        <span className={`flex items-center justify-center w-10 h-10 md:w-16.25 md:h-16.25 rounded-full text-sm md:text-base ${pathname === "/account" ? "bg-(--dark-orange) text-white" : "bg-(--light-orange)"}`}>
                            {name ? getInitials(name) : ''}
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer"
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                    >
                        <span className="sr-only">Ouvrir le menu</span>
                        {menuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M3 12h18M3 18h18" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg/3 flex flex-col gap-2 p-4 z-20">
                    <MenuItem href="/dashboard" logo="/dashboard.svg" text="Tableau de bord" alt="Icone de tableau de bord mobile" isActive={pathname === "/dashboard"} />
                    <MenuItem href="/projects" logo="/projects.svg" text="Projets" alt="Icone de dossier mobile" isActive={pathname.startsWith("/projects")} />
                </div>
            )}
        </header>
    );
}