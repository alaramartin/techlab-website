"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/admin/login");
        }
    }, [user, loading, router]);

    if (loading) return <p>Loading...</p>;
    if (!user) return null; // prevent flash of admin content

    return (
        <main>
            <h1>Admin Dashboard</h1>
            <p>Logged in as {user.email}</p>
            <button onClick={() => signOut(auth)}>Log Out</button>
        </main>
    );
}
