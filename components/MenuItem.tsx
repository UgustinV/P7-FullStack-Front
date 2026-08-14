"use client";

import Link from "next/link";
import Image from "next/image";

interface MenuItemProps {
    href: string;
    logo: string;
    text: string;
    isActive: boolean;
}

export function MenuItem({ href, logo, text, isActive }: MenuItemProps) {
  return (
    <Link
        href={href}
        className={`flex flex-row items-center justify-center w-full h-12 lg:w-60 lg:h-20 rounded-[10px] gap-4 ${isActive ? "bg-black text-white" : "text-black"}`}
    >
        <Image
            src={isActive ? logo.replace(".svg", "-selected.svg") : logo}
            alt={text}
            width={20}
            height={20}
            className="w-5 h-5"
        />
        <span className="text-xs lg:text-[16px]">{text}</span>
    </Link>
  );
}