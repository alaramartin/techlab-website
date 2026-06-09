"use client";
import { ArrowFatLineDownIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { serif } from "../ui/fonts";

export default function ScrollForMore() {
    const [mounted, setMounted] = useState(false);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const container = document.getElementById("scroll-root");
        if (!container) return;

        const onScroll = () => {
            setOpacity(container.scrollTop > 5 ? 0 : 1);
        };

        onScroll();
        setMounted(true);

        container.addEventListener("scroll", onScroll, { passive: true });
        return () => container.removeEventListener("scroll", onScroll);
    }, []);

    if (!mounted) return null;

    return (
        <div
            className="fixed bottom-0 flex items-end justify-center z-10 pointer-events-none"
            style={{ opacity, transition: "opacity 100ms" }}
        >
            <p
                className={`${serif.className} pb-4 inline-flex items-center gap-1.5 opacity-70 text-(--color-verylightpink)`}
            >
                Scroll for more
                <ArrowFatLineDownIcon size={24} className="animate-bounce" />
            </p>
        </div>
    );
}
