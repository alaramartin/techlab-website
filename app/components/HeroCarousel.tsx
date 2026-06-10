"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

// Placeholder slides — swap the SVGs in /public/landing for real photos.
const SLIDES = [
    { src: "/landing/photo-1.svg", alt: "Workshop photo" },
    { src: "/landing/photo-2.svg", alt: "Students at work" },
    { src: "/landing/photo-3.svg", alt: "Demo day" },
];

const INTERVAL_MS = 4500;

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);

    // A timeout keyed on `index` (rather than one long-lived interval) means
    // any manual navigation also resets the auto-advance clock.
    useEffect(() => {
        const id = setTimeout(
            () => setIndex((i) => (i + 1) % SLIDES.length),
            INTERVAL_MS,
        );
        return () => clearTimeout(id);
    }, [index]);

    const goTo = (i: number) =>
        setIndex((i + SLIDES.length) % SLIDES.length);

    const arrowClasses =
        "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-white hover:text-crimson transition-colors duration-200";

    return (
        <div className="relative w-full h-full overflow-hidden bg-neutral-100">
            {SLIDES.map((slide, i) => (
                <Image
                    key={slide.src}
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    className={`object-cover transition-opacity duration-1000 ${
                        i === index ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}

            <button
                onClick={() => goTo(index - 1)}
                aria-label="Previous slide"
                className={`${arrowClasses} left-4`}
            >
                <CaretLeftIcon size={20} />
            </button>
            <button
                onClick={() => goTo(index + 1)}
                aria-label="Next slide"
                className={`${arrowClasses} right-4`}
            >
                <CaretRightIcon size={20} />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5">
                {SLIDES.map((slide, i) => (
                    <button
                        key={slide.src}
                        onClick={() => goTo(i)}
                        aria-label={`Show slide ${i + 1}`}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            i === index
                                ? "bg-crimson"
                                : "bg-white/80 hover:bg-white"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
