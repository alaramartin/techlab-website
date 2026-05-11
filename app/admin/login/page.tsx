"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { serif } from "@/app/ui/fonts";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        <h1 className={`${serif.className} italic text-2xl mb-8`}>
          Admin Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-600 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-600 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
          {error && <p className="text-sm text-red-900">{error}</p>}
          <button
            type="submit"
            className="bg-black text-white text-sm py-2.5 mt-2"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
