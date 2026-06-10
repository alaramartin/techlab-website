"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { fetchPrograms, type ProgramWithProjects } from "@/lib/projects";
import { serif } from "@/app/ui/fonts";

const ease = [0.25, 0, 0, 1] as const;

const DESCRIPTION_PLACEHOLDER =
    "Program description coming soon — check back for details about the curriculum, schedule, and how to join.";

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

    // A skeleton row matching the real layout keeps the page height stable
    // (no footer jump / content shift) while programs are fetched.
    if (!loaded) {
        return (
            <section
                className="relative w-full"
                role="status"
                aria-label="Loading programs"
            >
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 hidden md:block" />
                <div
                    className="relative flex flex-col md:flex-row items-center py-14 md:py-20"
                    aria-hidden
                >
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-neutral-200 ring-4 ring-white hidden md:block z-10" />
                    <div className="w-full md:w-1/2 px-6 md:pl-16 md:pr-12 flex justify-center md:justify-end">
                        <div
                            className="skeleton w-full max-w-md"
                            style={{ aspectRatio: "1 / 1.414" }}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-6 md:pl-12 md:pr-16 mt-10 md:mt-0 flex flex-col gap-4">
                        <div className="skeleton h-3 w-32" />
                        <div className="skeleton h-10 w-3/4 max-w-sm" />
                        <div className="flex flex-col gap-2 max-w-md">
                            <div className="skeleton h-4 w-full" />
                            <div className="skeleton h-4 w-5/6" />
                            <div className="skeleton h-4 w-2/3" />
                        </div>
                        <div className="skeleton h-10 w-32 mt-2" />
                    </div>
                </div>
                <span className="sr-only">Loading programs…</span>
            </section>
        );
    }

    if (loaded && programs.length === 0) {
        return (
            <p className="text-sm text-neutral-500 font-sans px-6 md:px-16">
                No programs to show yet — check back soon.
            </p>
        );
    }

    return (
        <section className="relative w-full">
            {/* Spine down the center of the page */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 hidden md:block" />

            <div className="flex flex-col">
                {programs.map((program, index) => (
                    <motion.article
                        key={program.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-120px" }}
                        transition={{ duration: 0.6, ease }}
                        className="relative flex flex-col md:flex-row items-center py-14 md:py-20"
                    >
                        {/* Dot on the spine */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-crimson ring-4 ring-white hidden md:block z-10" />

                        {/* Poster — fills the left half, up against the spine */}
                        <div className="w-full md:w-1/2 px-6 md:pl-16 md:pr-12 flex justify-center md:justify-end">
                            <PosterFrame program={program} />
                        </div>

                        {/* Program info — right half */}
                        <div className="w-full md:w-1/2 px-6 md:pl-12 md:pr-16 mt-10 md:mt-0 flex flex-col gap-4">
                            <p className="text-xs text-crimson font-sans">
                                {program.timeframe || "Dates coming soon"}
                            </p>
                            <h2
                                className={`${serif.className} font-bold text-4xl md:text-5xl leading-tight`}
                            >
                                {program.name}
                            </h2>
                            <p className="text-base leading-relaxed text-neutral-600 font-sans max-w-md">
                                {program.description || DESCRIPTION_PLACEHOLDER}
                            </p>
                            {program.projects.length > 0 && (
                                <p className="text-sm text-neutral-500 font-sans">
                                    {program.projects.length} student{" "}
                                    {program.projects.length === 1
                                        ? "project"
                                        : "projects"}
                                </p>
                            )}
                            <Link
                                href={program.link || "#"}
                                target={program.link ? "_blank" : undefined}
                                rel={
                                    program.link
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                className="inline-flex items-center gap-2 w-fit bg-crimson text-white text-sm font-sans px-6 py-2.5 mt-2 hover:bg-crimson-dark hover:gap-3 transition-all"
                            >
                                Sign up <ArrowRightIcon size={15} />
                            </Link>
                        </div>

                        {/* Connector from spine to content on alternating rows is
                            unnecessary visual noise — the dot anchors each entry. */}
                        {index < programs.length - 1 && (
                            <div className="md:hidden w-px h-10 bg-neutral-200 absolute bottom-0 left-1/2" />
                        )}
                    </motion.article>
                ))}
            </div>
        </section>
    );
}

function PosterFrame({ program }: { program: ProgramWithProjects }) {
    const poster = (
        <div
            className="w-full max-w-md relative bg-neutral-100 border border-neutral-200 hover:border-crimson shadow-sm transition-colors duration-200 overflow-hidden"
            style={{ aspectRatio: "1 / 1.414" }}
        >
            {program.posterUrl ? (
                <Image
                    src={program.posterUrl}
                    alt={`${program.name} poster`}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className={`${serif.className} text-neutral-400 text-sm`}
                    >
                        poster coming soon
                    </span>
                </div>
            )}
        </div>
    );

    if (!program.link) return <div className="w-full max-w-md">{poster}</div>;

    return (
        <Link
            href={program.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-md"
        >
            {poster}
        </Link>
    );
}
