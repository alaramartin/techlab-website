"use client";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serif } from "@/app/ui/fonts";

type EmailEntry = {
  id: string;
  email: string;
  createdAt: Timestamp | null;
};

export default function EmailListSection() {
  const [entries, setEntries] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [addError, setAddError] = useState(false);
  const [copied, setCopied] = useState(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    setLoading(true);
    const q = query(collection(db, "email_list"), orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    setEntries(
      snap.docs.map((d) => {
        const data = d.data() as { email: string; createdAt: Timestamp | null };
        return {
          id: d.id,
          email: data.email,
          createdAt: data.createdAt ?? null,
        };
      })
    );
    setLoading(false);
  }

  function copyAll() {
    navigator.clipboard.writeText(entries.map((e) => e.email).join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function startEdit(id: string, value: string) {
    cancelRef.current = false;
    setEditingId(id);
    setEditingValue(value);
  }

  function cancelEdit() {
    cancelRef.current = true;
    setEditingId(null);
    setEditingValue("");
  }

  async function saveEdit(id: string) {
    if (!editingValue.trim()) {
      cancelEdit();
      return;
    }
    await updateDoc(doc(db, "email_list", id), { email: editingValue.trim() });
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, email: editingValue.trim() } : e
      )
    );
    setEditingId(null);
    setEditingValue("");
  }

  async function deleteEntry(id: string, email: string) {
    if (!window.confirm(`Delete "${email}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "email_list", id));
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  async function addEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setAddError(false);
    try {
      const docRef = await addDoc(collection(db, "email_list"), {
        email: newEmail.trim(),
        createdAt: serverTimestamp(),
      });
      setEntries((prev) => [
        ...prev,
        { id: docRef.id, email: newEmail.trim(), createdAt: null },
      ]);
      setNewEmail("");
    } catch {
      setAddError(true);
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${serif.className} italic text-xl`}>Email List</h2>
        <button
          onClick={copyAll}
          className="text-sm border border-neutral-200 px-3 py-1.5 hover:border-black"
        >
          {copied ? "Copied!" : "Copy all"}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-600">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-neutral-400">No emails yet.</p>
      ) : (
        <div className="flex flex-col">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 py-2.5 border-b border-neutral-100 group"
            >
              {editingId === entry.id ? (
                <>
                  <input
                    autoFocus
                    type="email"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    onBlur={() => {
                      if (!cancelRef.current) saveEdit(entry.id);
                      cancelRef.current = false;
                    }}
                    className="flex-1 border-b border-black outline-none text-sm py-0.5 bg-transparent"
                  />
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => saveEdit(entry.id)}
                    className="text-xs text-neutral-600"
                  >
                    ✓
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={cancelEdit}
                    className="text-xs text-neutral-400"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="flex-1 text-sm cursor-pointer"
                    onClick={() => startEdit(entry.id, entry.email)}
                  >
                    {entry.email}
                  </span>
                  <button
                    onClick={() => deleteEntry(entry.id, entry.email)}
                    className="text-xs text-neutral-300 hover:text-red-900 opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addEmail} className="flex gap-2 mt-6">
        <input
          type="email"
          placeholder="new@email.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="flex-1 border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black"
        />
        <button
          type="submit"
          className="bg-black text-white text-sm px-4 py-2"
        >
          Add
        </button>
      </form>
      {addError && (
        <p className="text-xs text-red-900 mt-2">Failed to add email.</p>
      )}
    </section>
  );
}
