"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { serif } from "@/app/ui/fonts";
import AccountsSection from "./sections/AccountsSection";
import EmailListSection from "./sections/EmailListSection";
import ProjectsSection from "./sections/ProjectsSection";

type Tab = "accounts" | "emails" | "projects";

const TABS: { id: Tab; label: string }[] = [
    { id: "accounts", label: "Accounts" },
    { id: "emails", label: "Email List" },
    { id: "projects", label: "Projects" },
];

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("accounts");

    useEffect(() => {
        if (!loading && !user) router.push("/admin/login");
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-neutral-600">Loading...</p>
            </div>
        );
    }
    if (!user) return null;

    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-neutral-200 px-8 py-4 flex items-center justify-between">
                <h1 className={`${serif.className} italic text-lg`}>
                    Girls in Tech Lab Admin
                </h1>
                <div className="flex items-center gap-6">
                    <span className="text-sm text-neutral-600">
                        {user.email}
                    </span>
                    <button
                        onClick={() => signOut(auth)}
                        className="text-sm border border-neutral-200 px-3 py-1.5 hover:border-black"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <div className="flex">
                <nav className="w-44 border-r border-neutral-200 pt-8 px-6 min-h-[calc(100vh-57px)] shrink-0">
                    <ul className="flex flex-col gap-0.5">
                        {TABS.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`cursor-pointer text-sm py-1.5 w-full text-left ${
                                        activeTab === tab.id
                                            ? "text-black font-medium"
                                            : "text-neutral-400 hover:text-black"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <main className="flex-1 px-10 py-8 max-w-4xl">
                    {activeTab === "accounts" && <AccountsSection />}
                    {activeTab === "emails" && <EmailListSection />}
                    {activeTab === "projects" && <ProjectsSection />}
                </main>
            </div>
        </div>
    );
}
