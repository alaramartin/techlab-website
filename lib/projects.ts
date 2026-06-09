import {
    collection,
    documentId,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

export type Project = {
    id: string;
    title: string;
    author: string;
    imageUrl: string;
    description: string;
};

export type Program = {
    id: string;
    name: string;
    timeframe: string;
    totalParticipants: number;
    // Optional program-level fields, rendered when present (e.g. on the timeline).
    description?: string;
    posterUrl?: string;
    link?: string;
};

export type ProgramWithProjects = Program & { projects: Project[] };

function toProject(id: string, data: Record<string, unknown>): Project {
    return {
        id,
        title: (data.title as string) ?? "",
        author: (data.author as string) ?? "",
        imageUrl: (data.imageUrl as string) ?? "",
        description: (data.description as string) ?? "",
    };
}

function toProgram(id: string, data: Record<string, unknown>): Program {
    return {
        id,
        name: (data.name as string) ?? id,
        timeframe: (data.timeframe as string) ?? "",
        totalParticipants: (data.totalParticipants as number) ?? 0,
        description: data.description as string | undefined,
        posterUrl: data.posterUrl as string | undefined,
        link: data.link as string | undefined,
    };
}

async function fetchStudentProjects(programId: string): Promise<Project[]> {
    const snapshot = await getDocs(
        collection(db, `projects/${programId}/student_projects`),
    );
    return snapshot.docs.map((p) => toProject(p.id, p.data()));
}

/** All programs with their student projects, ordered by id (year-prefixed). */
export async function fetchPrograms(): Promise<ProgramWithProjects[]> {
    const snapshot = await getDocs(collection(db, "projects"));

    const programs = await Promise.all(
        snapshot.docs.map(async (d) => ({
            ...toProgram(d.id, d.data()),
            projects: await fetchStudentProjects(d.id),
        })),
    );

    return programs.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * A single program with its student projects, or null if it doesn't exist.
 * Uses a collection query filtered by document id (a `list` read) rather than a
 * direct `getDoc` so it works under security rules that allow `list` but not `get`.
 */
export async function fetchProgram(
    programId: string,
): Promise<ProgramWithProjects | null> {
    const snapshot = await getDocs(
        query(collection(db, "projects"), where(documentId(), "==", programId)),
    );
    const programDoc = snapshot.docs[0];
    if (!programDoc) return null;

    return {
        ...toProgram(programDoc.id, programDoc.data()),
        projects: await fetchStudentProjects(programId),
    };
}
