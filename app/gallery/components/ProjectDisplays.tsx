"use client";
import { useState, useEffect } from "react";
import Carousel from "./Carousel";
import { serif } from "@/app/ui/fonts";
import { fetchPrograms, type ProgramWithProjects } from "@/lib/projects";

export default function ProjectDisplays() {
    const [programs, setPrograms] = useState<ProgramWithProjects[]>([]);

    useEffect(() => {
        fetchPrograms().then(setPrograms);
    }, []);

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
