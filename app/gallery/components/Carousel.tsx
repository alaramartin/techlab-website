"use client";
import CarouselItem from "./CarouselItem";
import { useEffect, useRef } from "react";
import { Project } from "./ProjectDisplays";

interface CarouselProps {
    projects: Project[];
}

export default function Carousel({ projects }: CarouselProps) {
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
            className="w-full overflow-hidden"
            onMouseEnter={() => (hoveredRef.current = true)}
            onMouseLeave={() => (hoveredRef.current = false)}
        >
            <div
                ref={trackRef}
                className="flex flex-row w-max will-change-transform items-center"
            >
                {tripled.map((item, i) => {
                    return (
                        <div key={i}>
                            <CarouselItem {...item} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
