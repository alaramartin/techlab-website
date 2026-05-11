"use client";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serif } from "@/app/ui/fonts";

type Project = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  description: string;
};

type Program = {
  id: string;
  name: string;
  projects: Project[];
};

type EditingCell = {
  programId: string;
  projectId: string;
  field: keyof Omit<Project, "id">;
} | null;

const PROJECT_FIELDS: Array<{
  key: keyof Omit<Project, "id">;
  label: string;
}> = [
  { key: "title", label: "Title" },
  { key: "author", label: "Author" },
  { key: "imageUrl", label: "Image URL" },
  { key: "description", label: "Description" },
];

const emptyNewProject = {
  programId: "",
  title: "",
  author: "",
  imageUrl: "",
  description: "",
};

export default function ProjectsSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [editingValue, setEditingValue] = useState("");
  const [newProject, setNewProject] = useState(emptyNewProject);
  const [addStatus, setAddStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const cancelRef = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const snap = await getDocs(collection(db, "projects"));
    const results = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data() as { name?: string };
        const projectsSnap = await getDocs(
          collection(db, `projects/${d.id}/student_projects`)
        );
        const projects: Project[] = projectsSnap.docs.map((p) => {
          const pd = p.data() as Record<string, string | undefined>;
          return {
            id: p.id,
            title: pd.title ?? "",
            author: pd.author ?? "",
            imageUrl: pd.imageUrl ?? "",
            description: pd.description ?? "",
          };
        });
        return { id: d.id, name: data.name ?? d.id, projects };
      })
    );
    setPrograms(results);
    if (results.length > 0 && !newProject.programId) {
      setNewProject((prev) => ({ ...prev, programId: results[0].id }));
    }
    setLoading(false);
  }

  function startEdit(
    programId: string,
    projectId: string,
    field: keyof Omit<Project, "id">,
    value: string
  ) {
    cancelRef.current = false;
    setEditingCell({ programId, projectId, field });
    setEditingValue(value);
  }

  function cancelEdit() {
    cancelRef.current = true;
    setEditingCell(null);
    setEditingValue("");
  }

  async function saveCell(
    programId: string,
    projectId: string,
    field: keyof Omit<Project, "id">
  ) {
    await updateDoc(
      doc(db, `projects/${programId}/student_projects/${projectId}`),
      { [field]: editingValue }
    );
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              projects: p.projects.map((proj) =>
                proj.id === projectId
                  ? { ...proj, [field]: editingValue }
                  : proj
              ),
            }
          : p
      )
    );
    setEditingCell(null);
    setEditingValue("");
  }

  async function deleteProject(
    programId: string,
    projectId: string,
    title: string
  ) {
    if (
      !window.confirm(
        `Delete project "${title || projectId}"? This cannot be undone.`
      )
    )
      return;
    await deleteDoc(
      doc(db, `projects/${programId}/student_projects/${projectId}`)
    );
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              projects: p.projects.filter((proj) => proj.id !== projectId),
            }
          : p
      )
    );
  }

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    const { programId, ...fields } = newProject;
    if (!programId) return;
    setAddStatus("idle");
    try {
      const docRef = await addDoc(
        collection(db, `projects/${programId}/student_projects`),
        fields
      );
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? {
                ...p,
                projects: [...p.projects, { id: docRef.id, ...fields }],
              }
            : p
        )
      );
      setNewProject((prev) => ({
        ...emptyNewProject,
        programId: prev.programId,
      }));
      setAddStatus("success");
    } catch {
      setAddStatus("error");
    }
  }

  if (loading) return <p className="text-sm text-neutral-600">Loading...</p>;

  return (
    <section>
      <h2 className={`${serif.className} italic text-xl mb-6`}>Projects</h2>

      {programs.map((program) => (
        <div key={program.id} className="mb-10">
          <p className="text-xs text-neutral-600 uppercase tracking-wide mb-3">
            {program.name}
          </p>

          <div className="grid grid-cols-[1fr_1fr_2fr_2fr_1.5rem] gap-3 pb-2 border-b border-neutral-200 text-xs text-neutral-600 uppercase tracking-wide">
            <span>Title</span>
            <span>Author</span>
            <span>Image URL</span>
            <span>Description</span>
            <span />
          </div>

          {program.projects.length === 0 && (
            <p className="text-sm text-neutral-400 py-3">No projects yet.</p>
          )}

          {program.projects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-[1fr_1fr_2fr_2fr_1.5rem] gap-3 py-2.5 border-b border-neutral-100 group items-start"
            >
              {PROJECT_FIELDS.map(({ key }) => {
                const isEditing =
                  editingCell?.programId === program.id &&
                  editingCell?.projectId === project.id &&
                  editingCell.field === key;

                return (
                  <div key={key} className="min-w-0">
                    {isEditing ? (
                      <input
                        autoFocus
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        onBlur={() => {
                          if (!cancelRef.current) {
                            saveCell(program.id, project.id, key);
                          }
                          cancelRef.current = false;
                        }}
                        className="w-full border-b border-black outline-none text-sm py-0.5 bg-transparent"
                      />
                    ) : (
                      <span
                        className="text-sm cursor-pointer break-words block"
                        onClick={() =>
                          startEdit(
                            program.id,
                            project.id,
                            key,
                            project[key]
                          )
                        }
                      >
                        {project[key] || (
                          <span className="text-neutral-300">—</span>
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() =>
                  deleteProject(program.id, project.id, project.title)
                }
                className="text-xs text-neutral-300 hover:text-red-900 opacity-0 group-hover:opacity-100 pt-0.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-4 pt-6 border-t border-neutral-200">
        <h3 className={`${serif.className} italic text-base mb-4`}>
          Add Project
        </h3>
        {programs.length === 0 ? (
          <p className="text-sm text-neutral-400">
            No programs found in Firestore.
          </p>
        ) : (
          <form onSubmit={addProject} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-600 uppercase tracking-wide">
                Program
              </label>
              <select
                value={newProject.programId}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    programId: e.target.value,
                  }))
                }
                required
                className="border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black bg-white"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(["title", "author", "imageUrl"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs text-neutral-600 uppercase tracking-wide">
                    {PROJECT_FIELDS.find((f) => f.key === key)?.label}
                  </label>
                  <input
                    type="text"
                    value={newProject[key]}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    required={key !== "imageUrl"}
                    className="border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-600 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                rows={3}
                className="border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white text-sm px-4 py-2 w-fit"
            >
              Add Project
            </button>
            {addStatus === "success" && (
              <p className="text-xs text-neutral-600">Project added.</p>
            )}
            {addStatus === "error" && (
              <p className="text-xs text-red-900">Failed to add project.</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
