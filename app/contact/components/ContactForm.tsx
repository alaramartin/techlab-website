"use client";
import { SyntheticEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!EMAIL_PATTERN.test(email.trim())) {
            setStatus("error");
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        setStatus("submitting");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    message: message.trim(),
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.error ?? "Something went wrong.");
            }

            setName("");
            setEmail("");
            setMessage("");
            setStatus("success");
        } catch (error) {
            setStatus("error");
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.",
            );
        }
    };

    const inputClasses =
        "w-full border border-neutral-300 bg-white px-4 py-3 text-sm font-sans focus:outline-none focus:border-crimson transition-colors placeholder:text-neutral-400";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans">
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="contact-name"
                    className="text-sm text-neutral-700"
                >
                    Name
                </label>
                <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className={inputClasses}
                    disabled={status === "submitting"}
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="contact-email"
                    className="text-sm text-neutral-700"
                >
                    Email
                </label>
                <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                    className={inputClasses}
                    disabled={status === "submitting"}
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="contact-message"
                    className="text-sm text-neutral-700"
                >
                    Message
                </label>
                <textarea
                    id="contact-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="How can we help?"
                    rows={6}
                    className={`${inputClasses} resize-y`}
                    disabled={status === "submitting"}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={status === "submitting"}
                className="w-fit bg-crimson text-white text-sm px-8 py-3 hover:bg-crimson-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {status === "submitting" ? "Sending..." : "Send message"}
            </button>

            {status === "success" && (
                <p className="text-sm text-neutral-700">
                    Thanks for reaching out! We&apos;ll get back to you soon.
                </p>
            )}
            {status === "error" && (
                <p className="text-sm text-crimson">{errorMessage}</p>
            )}
        </form>
    );
}
