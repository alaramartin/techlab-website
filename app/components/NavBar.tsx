"use client";
import Link from "next/link";
const navLinks = [
    { title: "Home", link: "/" },
    { title: "Gallery", link: "/gallery" },
    { title: "Programs", link: "/programs" },
    { title: "Contact", link: "/contact" },
];

export default function NavBar() {
    return (
        <div className={`fixed top-0 w-full px-4 md:px-8 py-4 z-50 bg-black bg-opacity-80`}>
            <div className="flex justify-end md:space-x-30 space-x-8">
                {navLinks.map((navLink) => {
                    return (
                        <div key={navLink.link} className="relative flex items-center">
                            <Link
                                href={navLink.link}
                                className="inline-flex p-2 rounded-md transition-colors"
                                style={{ color: 'var(--color-pink)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-pink)'}
                                aria-label={navLink.title}
                            >
                                <p
                                    className="mr-2 whitespace-nowrap
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
