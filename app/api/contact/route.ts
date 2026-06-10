import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const CONTACT_RECIPIENT = "alara.martin@gmail.com";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// One successful submission per IP per window. State is in-memory, so it
// resets on redeploy and isn't shared across serverless instances — fine as
// a spam speed bump at this site's scale.
const RATE_LIMIT_WINDOW_MS = 120_000;
const lastSubmissionByIp = new Map<string, number>();

function getClientIp(request: Request): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
    );
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    for (const [key, timestamp] of lastSubmissionByIp) {
        if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
            lastSubmissionByIp.delete(key);
        }
    }
    const last = lastSubmissionByIp.get(ip);
    return last !== undefined && now - last < RATE_LIMIT_WINDOW_MS;
}

export async function POST(request: Request) {
    let body: { name?: string; email?: string; message?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 },
        );
    }

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
        return NextResponse.json(
            { error: "Please fill out all fields." },
            { status: 400 },
        );
    }

    if (!EMAIL_PATTERN.test(email)) {
        return NextResponse.json(
            { error: "Please enter a valid email address." },
            { status: 400 },
        );
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
        return NextResponse.json(
            {
                error: "You just sent a message — please wait a couple of minutes before sending another.",
            },
            { status: 429 },
        );
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpUser || !smtpPass) {
        console.error(
            "Contact form: SMTP_USER / SMTP_PASS env vars are not set.",
        );
        return NextResponse.json(
            { error: "Email isn't configured yet. Please try again later." },
            { status: 500 },
        );
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
    });

    try {
        await transporter.sendMail({
            from: `"Girls in Tech Lab" <${smtpUser}>`,
            to: CONTACT_RECIPIENT,
            replyTo: email,
            subject: `Contact form message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        });
    } catch (error) {
        console.error("Contact form: failed to send email.", error);
        return NextResponse.json(
            { error: "Failed to send your message. Please try again." },
            { status: 500 },
        );
    }

    // Only successful sends count against the limit, so a failed attempt
    // doesn't lock the sender out for the full window.
    lastSubmissionByIp.set(ip, Date.now());

    return NextResponse.json({ ok: true });
}
