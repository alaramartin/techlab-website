"use client";
import CarouselItem from "./CarouselItem";
import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Project = {
    title: string;
    author: string;
    imageUrl: string;
    description: string;
};

export default function Carousel() {
    const [projects, setProjects] = useState<Project[]>([]);
    useEffect(() => {
        async function fetchProjects() {
            const snapshot = await getDocs(collection(db, "projects"));
            const data: Project[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Project, "id">),
            }));
            setProjects(data);
        }

        fetchProjects();
    }, []);

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
