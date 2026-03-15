"use client";
import CarouselItem from "./CarouselItem";
import { useEffect, useRef } from "react";

// note: placeholders. image string will be replaced with link to demo image of picture and will also contain a link to a live demo
const projects: {
    image: string;
    projectName: string;
    authorName: string;
}[] = [
    {
        image: "image.png",
        projectName: "my project",
        authorName: "author name",
    },
    {
        image: "image2.png",
        projectName: "my other project",
        authorName: "other author",
    },
];

export default function Carousel() {
    const tripled = [...projects, ...projects, ...projects];
    const offsetRef = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);
    // to keep track of the user hovering, to slow down when hover
    const hoveredRef = useRef(false);

    useEffect(() => {
        let animId: number;

        const animate = () => {
            offsetRef.current += hoveredRef.current ? 0.5 : 1; // px per frame

            // reset when scrolled through one full set
            const singleSetWidth = trackRef.current!.scrollWidth / 3;
            if (offsetRef.current >= singleSetWidth) {
                offsetRef.current = 0;
            }
            trackRef.current!.style.transform = `translateX(-${offsetRef.current}px)`;
            animId = requestAnimationFrame(animate);
        };

        animId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <div
            ref={trackRef}
            className="flex flex-row will-change-transform items-center"
            onMouseEnter={() => (hoveredRef.current = true)}
            onMouseLeave={() => (hoveredRef.current = false)}
        >
            {tripled.map((item, i) => {
                return (
                    <div key={i}>
                        <CarouselItem {...item} />
                    </div>
                );
            })}
        </div>
    );
}
