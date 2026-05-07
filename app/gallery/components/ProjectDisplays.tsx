"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Carousel from "./Carousel";

export type Project = {
    id?: string;
    title: string;
    author: string;
    imageUrl: string;
    description: string;
};

type ProgramMeta = {
    id: string;
    name: string;
    timeframe: string;
    totalParticipants: number;
};

type ProgramWithProjects = ProgramMeta & { projects: Project[] };

export default function ProjectDisplays() {
    const [programs, setPrograms] = useState<ProgramWithProjects[]>([]);

    useEffect(() => {
        async function fetchProjectsByProgram() {
            const snapshot = await getDocs(collection(db, "projects"));

            const results = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const meta = doc.data() as Partial<ProgramMeta>;
                    const projectsSnapshot = await getDocs(
                        collection(db, `projects/${doc.id}/student_projects`),
                    );
                    const projects: Project[] = projectsSnapshot.docs.map(
                        (p) => ({
                            id: p.id,
                            ...(p.data() as Omit<Project, "id">),
                        }),
                    );
                    return {
                        id: doc.id,
                        name: meta.name,
                        timeframe: meta.timeframe,
                        totalParticipants: meta.totalParticipants,
                        ...meta,
                        projects,
                    } as ProgramWithProjects;
                }),
            );

            setPrograms(results);
        }

        fetchProjectsByProgram();
    }, []);

    return (
        <div className="w-full overflow-hidden flex flex-col gap-10">
            {programs.map((program) => (
                <div key={program.id} className="flex flex-col w-full">
                    <p className="mb-2">
                        {program.timeframe} {program.name} (showing{" "}
                        {program.projects.length}/{program.totalParticipants}{" "}
                        projects)
                    </p>

                    <div className="w-full">
                        <Carousel projects={program.projects} />
                    </div>
                </div>
            ))}
        </div>
    );
}
