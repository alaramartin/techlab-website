import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]!;
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function GET() {
  try {
    const result = await getAuth(getAdminApp()).listUsers(1000);
    const users = result.users.map((u) => ({
      uid: u.uid,
      email: u.email ?? "",
      createdAt: u.metadata.creationTime,
    }));
    return NextResponse.json({ users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to list users.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    const u = await getAuth(getAdminApp()).createUser({ email, password });
    return NextResponse.json({
      uid: u.uid,
      email: u.email ?? email,
      createdAt: u.metadata.creationTime,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = typeof body.uid === "string" ? body.uid : "";
    if (!uid) {
      return NextResponse.json({ error: "UID is required." }, { status: 400 });
    }
    const updates: { email?: string; password?: string } = {};
    if (typeof body.email === "string" && body.email.trim()) {
      updates.email = body.email.trim();
    }
    if (typeof body.password === "string" && body.password) {
      updates.password = body.password;
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided." }, { status: 400 });
    }
    const u = await getAuth(getAdminApp()).updateUser(uid, updates);
    return NextResponse.json({ uid: u.uid, email: u.email ?? "" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = typeof body.uid === "string" ? body.uid : "";
    if (!uid) {
      return NextResponse.json({ error: "UID is required." }, { status: 400 });
    }
    await getAuth(getAdminApp()).deleteUser(uid);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
