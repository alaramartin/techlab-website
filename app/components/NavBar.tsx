"use client";
import Link from "next/link";
import { serif } from "../ui/fonts";

const navLinks = [
    { title: "Gallery", link: "/gallery" },
    { title: "Programs", link: "/programs" },
    { title: "Contact", link: "/contact" },
];

export default function NavBar() {
    return (
        <nav className="fixed top-0 w-full px-6 md:px-12 h-16 z-50 border-b border-neutral-200 bg-white flex items-center justify-between">
            <Link
                href="/"
                className={`${serif.className} text-red-900 text-lg whitespace-nowrap`}
            >
                Girls in Tech Lab
            </Link>
            <div className="flex items-center gap-8 md:gap-12 font-sans text-sm">
                {navLinks.map((navLink) => (
                    <Link
                        key={navLink.link}
                        href={navLink.link}
                        className="whitespace-nowrap text-neutral-700 hover:text-red-900 transition-colors duration-200"
                    >
                        {navLink.title}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
