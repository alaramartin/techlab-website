"use client";
import { SyntheticEvent, useState } from "react";
import {
    doc,
    runTransaction,
    serverTimestamp,
    type FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Subscribe() {
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
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md border border-neutral-300 bg-white p-8 shadow-sm flex flex-col gap-4"
        >
            <p className="text-sm text-neutral-500 font-sans">
                Get notified about upcoming workshops and events.
            </p>

            <div className="flex flex-col gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                    className="border border-neutral-300 px-4 py-2 text-sm font-sans focus:outline-none focus:border-red-900 transition-colors"
                    disabled={isSubmitting}
                    required
                />

                <button
                    type="submit"
                    className="bg-black text-white text-sm font-sans px-4 py-2 hover:bg-red-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                {statusMessage && (
                    <p className="text-sm text-neutral-600 font-sans">
                        {statusMessage}
                    </p>
                )}
            </div>
        </form>
    );
}
