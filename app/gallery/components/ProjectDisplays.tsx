"use client";
import { useState, useEffect } from "react";
import Carousel from "./Carousel";
import { serif } from "@/app/ui/fonts";
import { fetchPrograms, type ProgramWithProjects } from "@/lib/projects";

export default function ProjectDisplays() {
    const [programs, setPrograms] = useState<ProgramWithProjects[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetchPrograms().then((result) => {
            setPrograms(result);
            setLoaded(true);
        });
    }, []);

    // A skeleton row matching the real layout keeps the page height stable
    // (no footer jump / content shift) while projects are fetched.
    if (!loaded) {
        return (
            <div
                role="status"
                aria-label="Loading projects"
                className="w-full overflow-hidden flex flex-col"
            >
                <div aria-hidden>
                    <div className="skeleton h-7 w-64 mb-3" />
                    <div className="skeleton h-4 w-44 mb-6" />
                    <div className="flex flex-row overflow-hidden">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="m-4 w-56 shrink-0 border border-neutral-200 bg-white"
                            >
                                <div className="skeleton h-36 w-full" />
                                <div className="px-4 py-3 flex flex-col gap-2">
                                    <div className="skeleton h-4 w-3/4" />
                                    <div className="skeleton h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <span className="sr-only">Loading projects…</span>
            </div>
        );
    }

    if (programs.length === 0) {
        return (
            <p className="text-sm text-neutral-500 font-sans">
                No projects to show yet — check back soon.
            </p>
        );
    }

    return (
        <div className="w-full overflow-hidden flex flex-col gap-16">
            {programs.map((program) => (
                <div key={program.id} className="flex flex-col w-full">
                    <h2 className={`text-2xl mb-1 ${serif.className}`}>
                        {program.name}
                    </h2>
                    <p className="text-sm text-neutral-500 font-sans mb-6">
                        {program.timeframe} &middot; {program.projects.length}/
                        {program.totalParticipants} projects
                    </p>
                    <div className="w-full">
                        <Carousel projects={program.projects} />
                    </div>
                </div>
            ))}
        </div>
    );
}
