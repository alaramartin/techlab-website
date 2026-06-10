import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { geistSans } from "./ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
    title: "Girls in Tech Lab",
    description:
        "Student-run programs helping girls in Palo Alto get started in tech.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} antialiased`}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
