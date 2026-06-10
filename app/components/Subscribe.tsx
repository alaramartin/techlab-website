"use client";
import { SyntheticEvent, useState } from "react";
import {
    doc,
    runTransaction,
    serverTimestamp,
    type FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

// `dark` renders the form for the crimson footer; default is for light pages.
export default function Subscribe({ dark = false }: { dark?: boolean }) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            setStatusMessage("Please enter an email address.");
            return;
        }

        setIsSubmitting(true);
        setStatusMessage("");

        try {
            const emailDocId = encodeURIComponent(normalizedEmail);
            const emailDocRef = doc(db, "email_list", emailDocId);

            await runTransaction(db, async (transaction) => {
                const existingEmailDoc = await transaction.get(emailDocRef);
                if (existingEmailDoc.exists()) {
                    throw new Error("DUPLICATE_EMAIL");
                }

                transaction.set(emailDocRef, {
                    email: normalizedEmail,
                    createdAt: serverTimestamp(),
                });
            });

            setEmail("");
            setStatusMessage("Thanks! You are now subscribed.");
        } catch (error) {
            const firestoreError = error as FirestoreError;
            if (error instanceof Error && error.message === "DUPLICATE_EMAIL") {
                setStatusMessage("This email is already subscribed.");
            } else if (firestoreError.code === "already-exists") {
                setStatusMessage("This email is already subscribed.");
            } else {
                setStatusMessage("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md font-sans">
            <div
                className={`flex items-center gap-3 border-b pb-3 transition-colors ${
                    dark
                        ? "border-white/40 focus-within:border-white"
                        : "border-neutral-300 focus-within:border-crimson"
                }`}
            >
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                    className={`flex-1 bg-transparent text-sm focus:outline-none ${
                        dark
                            ? "text-white placeholder:text-white/50"
                            : "text-neutral-900 placeholder:text-neutral-400"
                    }`}
                    disabled={isSubmitting}
                    required
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center gap-1.5 text-sm whitespace-nowrap transition-all hover:gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed ${
                        dark ? "text-white" : "text-crimson"
                    }`}
                >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                    <ArrowRightIcon size={15} />
                </button>
            </div>

            {statusMessage && (
                <p
                    className={`mt-3 text-sm ${
                        dark ? "text-white/80" : "text-neutral-600"
                    }`}
                >
                    {statusMessage}
                </p>
            )}
        </form>
    );
}
