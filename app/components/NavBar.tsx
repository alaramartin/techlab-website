"use client";
import Link from "next/link";
const navLinks = [
    { title: "Gallery", link: "/gallery" },
    { title: "Programs", link: "/programs" },
    { title: "Contact", link: "/contact" },
];

export default function NavBar() {
    return (
        <div
            className={`fixed top-0 w-full px-4 md:px-8 z-50 border-b border-gray-300 bg-white`}
        >
            <Link
                href="/"
                className="flex justify-start translate-y-1/2 underline"
            >
                logo/home
            </Link>
            <div className="flex justify-end md:space-x-30 space-x-8">
                {navLinks.map((navLink) => {
                    return (
                        <div key={navLink.link} className="flex">
                            <Link
                                href={navLink.link}
                                className="inline-flex"
                                aria-label={navLink.title}
                            >
                                <p
                                    className="whitespace-nowrap underline -translate-y-1/2
                                           transition-opacity duration-200 pointer-events-auto"
                                    aria-hidden="true"
                                >
                                    {navLink.title}
                                </p>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
