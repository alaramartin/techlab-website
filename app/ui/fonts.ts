import { Noto_Serif, Geist } from "next/font/google";

export const serif = Noto_Serif({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
});

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
