"use client";
import { useState, useEffect, useRef } from "react";
import { serif } from "@/app/ui/fonts";

type AdminUser = {
    uid: string;
    email: string;
    createdAt: string;
};

export default function AccountsSection() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingEmail, setEditingEmail] = useState("");
    const [settingPwdId, setSettingPwdId] = useState<string | null>(null);
    const [newPwd, setNewPwd] = useState("");
    const [pwdError, setPwdError] = useState("");
    const [newEmail, setNewUserEmail] = useState("");
    const [newPassword, setNewUserPassword] = useState("");
    const [createStatus, setCreateStatus] = useState<
        "idle" | "success" | "error"
    >("idle");
    const [createMessage, setCreateMessage] = useState("");
    const cancelRef = useRef(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        const res = await fetch("/api/admin/users");
        if (res.ok) {
            const data = await res.json();
            setUsers(data.users);
        }
        setLoading(false);
    }

    function startEditEmail(uid: string, email: string) {
        cancelRef.current = false;
        setSettingPwdId(null);
        setNewPwd("");
        setPwdError("");
        setEditingId(uid);
        setEditingEmail(email);
    }

    function cancelEditEmail() {
        cancelRef.current = true;
        setEditingId(null);
        setEditingEmail("");
    }

    async function saveEmail(uid: string) {
        if (!editingEmail.trim()) {
            cancelEditEmail();
            return;
        }
        const res = await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, email: editingEmail }),
        });
        if (res.ok) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.uid === uid ? { ...u, email: editingEmail.trim() } : u,
                ),
            );
        }
        setEditingId(null);
        setEditingEmail("");
    }

    async function savePassword(uid: string) {
        setPwdError("");
        if (!newPwd) return;
        const res = await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, password: newPwd }),
        });
        if (res.ok) {
            setSettingPwdId(null);
            setNewPwd("");
        } else {
            const data = await res.json();
            setPwdError(data.error ?? "Failed to update password.");
        }
    }

    async function deleteUser(uid: string, email: string) {
        if (!window.confirm(`Delete user "${email}"? This cannot be undone.`))
            return;
        const res = await fetch("/api/admin/users", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid }),
        });
        if (res.ok) setUsers((prev) => prev.filter((u) => u.uid !== uid));
    }

    async function createUser(e: React.FormEvent) {
        e.preventDefault();
        setCreateStatus("idle");
        setCreateMessage("");
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: newEmail,
                    password: newPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setUsers((prev) => [
                ...prev,
                { uid: data.uid, email: data.email, createdAt: data.createdAt },
            ]);
            setCreateStatus("success");
            setCreateMessage(`User ${newEmail} created.`);
            setNewUserEmail("");
            setNewUserPassword("");
        } catch (err: unknown) {
            setCreateStatus("error");
            setCreateMessage(
                err instanceof Error ? err.message : "Failed to create user.",
            );
        }
    }

    return (
        <section>
            <h2 className={`${serif.className} italic text-xl mb-6`}>
                Admin Users
            </h2>

            {loading ? (
                <p className="text-sm text-neutral-600">Loading...</p>
            ) : (
                <>
                    <div className="grid grid-cols-[2fr_1fr_auto_auto] gap-3 pb-2 border-b border-neutral-200 text-xs text-neutral-600 uppercase tracking-wide">
                        <span>Email</span>
                        <span>Created</span>
                        <span />
                        <span />
                    </div>

                    {users.length === 0 && (
                        <p className="text-sm text-neutral-400 py-3">
                            No users found.
                        </p>
                    )}

                    {users.map((user) => (
                        <div
                            key={user.uid}
                            className="border-b border-neutral-100 group"
                        >
                            <div className="grid grid-cols-[2fr_1fr_auto_auto] gap-3 py-2.5 items-center">
                                <div className="min-w-0">
                                    {editingId === user.uid ? (
                                        <input
                                            autoFocus
                                            type="email"
                                            value={editingEmail}
                                            onChange={(e) =>
                                                setEditingEmail(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    e.currentTarget.blur();
                                                if (e.key === "Escape")
                                                    cancelEditEmail();
                                            }}
                                            onBlur={() => {
                                                if (!cancelRef.current)
                                                    saveEmail(user.uid);
                                                cancelRef.current = false;
                                            }}
                                            className="w-full border-b border-black outline-none text-sm py-0.5 bg-transparent"
                                        />
                                    ) : (
                                        <>
                                            <span
                                                className="text-sm cursor-pointer block"
                                                onClick={() =>
                                                    startEditEmail(
                                                        user.uid,
                                                        user.email,
                                                    )
                                                }
                                            >
                                                {user.email}
                                            </span>
                                            <span className="text-xs text-neutral-400 truncate block">
                                                {user.uid}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <span className="text-sm text-neutral-600">
                                    {user.createdAt
                                        ? new Date(
                                              user.createdAt,
                                          ).toLocaleDateString()
                                        : "—"}
                                </span>
                                <button
                                    onClick={() => {
                                        if (settingPwdId === user.uid) {
                                            setSettingPwdId(null);
                                            setNewPwd("");
                                            setPwdError("");
                                        } else {
                                            setSettingPwdId(user.uid);
                                            setNewPwd("");
                                            setPwdError("");
                                        }
                                    }}
                                    className="text-xs text-neutral-400 hover:text-black whitespace-nowrap"
                                >
                                    Set pwd
                                </button>
                                <button
                                    onClick={() =>
                                        deleteUser(user.uid, user.email)
                                    }
                                    className="text-xs text-neutral-300 hover:text-red-900 opacity-0 group-hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </div>

                            {settingPwdId === user.uid && (
                                <div className="flex items-center gap-2 pb-3">
                                    <input
                                        autoFocus
                                        type="password"
                                        placeholder="New password"
                                        value={newPwd}
                                        onChange={(e) =>
                                            setNewPwd(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                savePassword(user.uid);
                                            if (e.key === "Escape") {
                                                setSettingPwdId(null);
                                                setNewPwd("");
                                                setPwdError("");
                                            }
                                        }}
                                        className="border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-black"
                                    />
                                    <button
                                        onClick={() => savePassword(user.uid)}
                                        className="text-sm bg-black text-white px-3 py-1.5"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSettingPwdId(null);
                                            setNewPwd("");
                                            setPwdError("");
                                        }}
                                        className="text-sm text-neutral-400"
                                    >
                                        Cancel
                                    </button>
                                    {pwdError && (
                                        <p className="text-xs text-red-900">
                                            {pwdError}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}

            <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className={`${serif.className} italic text-base mb-4`}>
                    Create Account
                </h3>
                <form
                    onSubmit={createUser}
                    className="flex flex-col gap-4 max-w-sm"
                >
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-neutral-600 uppercase tracking-wide">
                            Email
                        </label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            required
                            className="border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-neutral-600 uppercase tracking-wide">
                            Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            required
                            className="border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-black text-white text-sm px-4 py-2 w-fit"
                    >
                        Create User
                    </button>
                    {createStatus === "success" && (
                        <p className="text-sm text-neutral-600">
                            {createMessage}
                        </p>
                    )}
                    {createStatus === "error" && (
                        <p className="text-sm text-red-900">{createMessage}</p>
                    )}
                </form>
            </div>
        </section>
    );
}
