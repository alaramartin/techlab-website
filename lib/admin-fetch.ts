"use client";
import { auth } from "@/lib/firebase";

/**
 * fetch() for admin API routes — attaches the signed-in user's Firebase ID
 * token as a Bearer token, which the server verifies before acting.
 */
export async function adminFetch(
    input: RequestInfo | URL,
    init: RequestInit = {},
): Promise<Response> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not signed in.");

    const token = await user.getIdToken();
    return fetch(input, {
        ...init,
        headers: {
            ...init.headers,
            Authorization: `Bearer ${token}`,
        },
    });
}
