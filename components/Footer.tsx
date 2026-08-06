import Image from "next/image";

export function Footer() {
    return (
        <footer className="h-17 flex items-center px-7.5 justify-between bg-white">
            <Image src="/logo-dark.svg"
            alt="Logo"
            width={100}
            height={13}
            className="w-25 h-3.25"
            />
            <p className="text-gray-600 text-sm">
                Abricot {new Date().getFullYear()}
            </p>
        </footer>
    );
}