"use client";

import Link from "next/link";
import Image from "next/image";

interface MenuItemProps {
    href: string;
    logo: string;
    text: string;
    alt: string;
    isActive: boolean;
}

export function MenuItem({ href, logo, text, alt, isActive }: MenuItemProps) {
  return (
    <Link
        href={href}
        className={`flex flex-row items-center justify-center w-full md:w-32 h-12 lg:w-60 lg:h-20 rounded-[10px] gap-2 lg:gap-4 ${isActive ? "bg-black text-white" : "text-black"}`}
    >
        <Image
            src={isActive ? logo.replace(".svg", "-selected.svg") : logo}
            alt={alt}
            width={20}
            height={20}
            className="w-4 h-4 lg:w-5 lg:h-5"
        />
        <span className="text-xs text-nowrap lg:text-[16px]">{text}</span>
    </Link>
  );
}