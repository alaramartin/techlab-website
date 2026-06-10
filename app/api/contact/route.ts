import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const CONTACT_RECIPIENT = "alara.martin@gmail.com";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    return NextResponse.json({ ok: true });
}
