import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp, verifyAdminRequest } from "@/lib/firebase-admin";

const unauthorized = () =>
    NextResponse.json({ error: "Unauthorized." }, { status: 401 });

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req))) return unauthorized();
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
  if (!(await verifyAdminRequest(req))) return unauthorized();
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
  if (!(await verifyAdminRequest(req))) return unauthorized();
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
  const caller = await verifyAdminRequest(req);
  if (!caller) return unauthorized();
  try {
    const body = await req.json();
    const uid = typeof body.uid === "string" ? body.uid : "";
    if (!uid) {
      return NextResponse.json({ error: "UID is required." }, { status: 400 });
    }
    if (uid === caller.uid) {
      return NextResponse.json(
        { error: "You can't delete your own account." },
        { status: 400 }
      );
    }
    await getAuth(getAdminApp()).deleteUser(uid);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
