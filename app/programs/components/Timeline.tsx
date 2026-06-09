"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { fetchPrograms, type ProgramWithProjects } from "@/lib/projects";
import { serif } from "@/app/ui/fonts";

const ease = [0.25, 0, 0, 1] as const;

export default function Timeline() {
    const [programs, setPrograms] = useState<ProgramWithProjects[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetchPrograms().then((result) => {
            // Most recent first.
            setPrograms([...result].reverse());
            setLoaded(true);
        });
    }, []);

    if (loaded && programs.length === 0) {
        return (
            <p className="text-sm text-neutral-500 font-sans">
                No programs to show yet — check back soon.
            </p>
        );
    }

    return (
        <section className="relative w-full max-w-3xl">
            {/* Spine */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-200" />

            <div className="flex flex-col">
                {programs.map((program, index) => {
                    const poster = (
                        <div
                            className="w-44 relative bg-neutral-100 border border-neutral-200 hover:border-neutral-400 transition-colors duration-200 overflow-hidden"
                            style={{ aspectRatio: "1 / 1.414" }}
                        >
                            {program.posterUrl && (
                                <Image
                                    src={program.posterUrl}
                                    alt={`${program.name} poster`}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                    );

                    return (
                        <motion.div
                            key={program.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{
                                duration: 0.5,
                                delay: 0.1 * index,
                                ease,
                            }}
                            className="relative pl-12 pb-20"
                        >
                            {/* Dot on the spine */}
                            <div className="absolute left-0 top-2 w-2.5 h-2.5 bg-red-900 -translate-x-1/2" />

                            <p className="text-xs text-neutral-500 font-sans mb-1">
                                {program.timeframe}
                            </p>
                            <h2 className={`text-2xl mb-5 ${serif.className}`}>
                                {program.name}
                            </h2>

                            {/* Poster + description */}
                            <div className="flex gap-8 items-start">
                                {program.link ? (
                                    <Link
                                        href={program.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0"
                                    >
                                        {poster}
                                    </Link>
                                ) : (
                                    <div className="shrink-0">{poster}</div>
                                )}

                                <div className="pt-1 max-w-prose">
                                    {program.description && (
                                        <p className="text-base leading-relaxed text-neutral-700 font-sans">
                                            {program.description}
                                        </p>
                                    )}
                                    <p className="text-sm text-neutral-500 font-sans mt-3">
                                        {program.projects.length} student{" "}
                                        {program.projects.length === 1
                                            ? "project"
                                            : "projects"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
