"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "@/components/MenuItem";
import { usePathname } from "next/navigation";
import { getInitials } from "@/app/lib/utils";

export function Header({ name }: { name?: string }) {
    return (
        <header className="h-24 flex items-center px-25 shadow-lg/3">
            <nav className="flex items-center justify-between w-full">
                <Link href="/dashboard">
                    <Image src="/logo.svg"
                    alt="Logo"
                    width={150}
                    height={19}
                    />
                </Link>
                <div className="flex gap-4">
                    <MenuItem href="/dashboard" logo="/dashboard.svg" text="Tableau de bord" isActive={usePathname() === "/dashboard"} />
                    <MenuItem href="/projects" logo="/projects.svg" text="Projets" isActive={usePathname().startsWith("/projects")} />
                </div>
                <Link href="/account">
                    <span className={`flex items-center justify-center w-16.25 h-16.25 rounded-full ${usePathname() === "/account" ? "bg-(--dark-orange) text-white" : "bg-(--light-orange)"}`}>
                        {name ? getInitials(name) : ''}
                    </span>
                </Link>
            </nav>
        </header>
    );
}