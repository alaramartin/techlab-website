// Server-only Firebase Admin SDK setup and request authentication.
// Do not import this from client components.
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";

export function getAdminApp(): App {
    if (getApps().length > 0) return getApps()[0]!;
    return initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

/**
 * Authenticates an admin API request: expects "Authorization: Bearer <Firebase
 * ID token>" and returns the decoded token, or null when missing or invalid.
 *
 * Every Firebase Auth user counts as an admin — accounts are only created
 * through the admin dashboard. This requires self-signup to be disabled in
 * Firebase Console (Authentication → Settings → User actions).
 */
export async function verifyAdminRequest(
    request: Request,
): Promise<DecodedIdToken | null> {
    const header = request.headers.get("authorization") ?? "";
    const match = header.match(/^Bearer (.+)$/i);
    if (!match) return null;

    try {
        return await getAuth(getAdminApp()).verifyIdToken(match[1]);
    } catch {
        return null;
    }
}
