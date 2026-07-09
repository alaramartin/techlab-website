"use client";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import HeroCarousel from "./components/HeroCarousel";
import Footer from "./components/Footer";
import { serif } from "./ui/fonts";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/projects";

// Lazy-load the newsletter widget so the Firebase client SDK it pulls in isn't
// on the homepage's initial compile/render path.
const Subscribe = dynamic(() => import("./components/Subscribe"));

// The homepage spotlights a few projects from the most recent program.
const FEATURED_PROGRAM_ID = "2026_gamelab";

// Empty cards keep the collage from collapsing before data loads.
const PLACEHOLDER_CARDS: Project[] = [0, 1, 2].map((i) => ({
    id: `placeholder-${i}`,
    title: "",
    author: "",
    imageUrl: "",
    description: "",
}));

const MARQUEE_WORDS = [
    "code",
    "create",
    "community",
    "workshops",
    "mentorship",
    "projects",
];

const ease = [0.25, 0, 0, 1] as const;

const landingFade = (delay = 0) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease },
});

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, delay, ease },
});

function Marquee() {
    // The word list is rendered twice so the -50% keyframe loops seamlessly.
    const strip = (
        <div className="flex shrink-0 items-center">
            {MARQUEE_WORDS.map((word) => (
                <span
                    key={word}
                    className={`${serif.className} italic text-lg md:text-xl text-neutral-400 px-8 inline-flex items-center gap-8`}
                >
                    {word}
                    <span className="text-crimson not-italic text-sm">✶</span>
                </span>
            ))}
        </div>
    );

    return (
        <div className="w-full border-y border-neutral-200 py-4 overflow-hidden">
            <div className="flex w-max animate-marquee">
                {strip}
                {strip}
            </div>
        </div>
    );
}

export default function Page() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        // Defer loading the Firebase-backed data layer until after mount so it
        // stays out of the homepage's static import graph.
        import("@/lib/projects").then(({ fetchProgram }) =>
            fetchProgram(FEATURED_PROGRAM_ID).then((program) => {
                if (program) setProjects(program.projects.slice(0, 3));
            })
        );
    }, []);

    return (
        <>
            <NavBar />

            {/* ─── LANDING ─────────────────────────────────────────────── */}
            <section
                className={`min-h-screen flex flex-col pt-16 ${serif.className}`}
            >
                <div className="flex-1 flex flex-col md:flex-row">
                    <motion.div
                        {...landingFade()}
                        className="md:w-7/12 h-72 md:h-auto relative"
                    >
                        <HeroCarousel />
                    </motion.div>

                    <div className="md:w-5/12 flex flex-col justify-center items-start px-6 md:px-16 py-14 gap-4">
                        <motion.p
                            {...landingFade(0.1)}
                            className="text-xs text-crimson font-sans"
                        >
                            Based in Palo Alto
                        </motion.p>
                        <motion.h1
                            {...landingFade(0.25)}
                            className="text-5xl md:text-6xl leading-tight"
                        >
                            Girls belong in tech.
                        </motion.h1>
                        <motion.p
                            {...landingFade(0.4)}
                            className="text-xl text-neutral-600"
                        >
                            We help get them started.
                        </motion.p>
                        <motion.div
                            {...landingFade(0.55)}
                            className="flex items-center gap-8 mt-6 font-sans text-sm"
                        >
                            <Link
                                href="/programs"
                                className="bg-crimson text-white px-7 py-3 hover:bg-crimson-dark transition-colors"
                            >
                                See our programs
                            </Link>
                            <Link
                                href="/gallery"
                                className="inline-flex items-center gap-2 text-crimson hover:gap-3 transition-all"
                            >
                                Student work <ArrowRightIcon size={15} />
                            </Link>
                        </motion.div>
                    </div>
                </div>
                <motion.div {...landingFade(0.7)}>
                    <Marquee />
                </motion.div>
            </section>

            {/* ─── MISSION / MOST RECENT EVENT ─────────────────────────── */}
            <section
                className={`min-h-screen flex flex-col md:flex-row bg-cream ${serif.className}`}
            >
                <motion.div
                    {...fadeIn(0.15)}
                    className="md:w-1/2 flex flex-col justify-center px-6 md:px-16 py-20 gap-6"
                >
                    <p className="text-xs text-crimson font-sans">
                        Our Mission
                    </p>
                    <h2 className="text-4xl md:text-5xl leading-tight">
                        Women hold fewer than{" "}
                        <span className="text-crimson">1 in 4</span> computing
                        jobs.
                    </h2>
                    <p className="text-base leading-relaxed text-neutral-600 max-w-md font-sans">
                        As high school students in Palo Alto, we&apos;ve seen
                        the gap firsthand. We run events year-round to help
                        close it. Here is our most recent one.
                    </p>
                </motion.div>

                <motion.div
                    {...fadeIn()}
                    className="md:w-1/2 flex items-center justify-center py-20 px-6 md:px-16"
                >
                    <div
                        className="w-full max-w-xs bg-white border border-neutral-200 shadow-sm relative"
                        style={{ aspectRatio: "1 / 1.414" }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-neutral-400 text-sm">
                                poster
                            </span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── STUDENT PROJECTS ────────────────────────────────────── */}
            <section
                className={`min-h-screen flex flex-col md:flex-row items-center px-6 md:px-16 py-24 gap-12 ${serif.className}`}
            >
                <motion.div
                    {...fadeIn()}
                    className="md:w-2/5 flex flex-col gap-4 md:self-center"
                >
                    <p className="text-xs text-crimson font-sans">Portfolio</p>
                    <h2 className="text-4xl md:text-5xl leading-tight">
                        Our students do real work.
                    </h2>
                    <p className="text-base leading-relaxed text-neutral-600 max-w-md font-sans">
                        Here are some highlights.
                    </p>
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-2 text-sm font-sans text-crimson hover:gap-3 transition-all mt-4"
                    >
                        View our full project gallery{" "}
                        <ArrowRightIcon size={16} />
                    </Link>
                </motion.div>

                <div className="md:w-3/5 w-full flex items-center justify-center">
                    <div
                        className="relative"
                        style={{ width: "21rem", height: "21rem" }}
                    >
                        {(projects.length > 0
                            ? projects
                            : PLACEHOLDER_CARDS
                        ).map((project, i) => (
                            <motion.div
                                key={project.id || i}
                                {...fadeIn(0.1 * (i + 1))}
                                style={{
                                    top: i * 72,
                                    left: i * 64,
                                    zIndex: i,
                                }}
                                className="absolute w-52 bg-white border border-neutral-200 hover:border-crimson shadow-sm overflow-hidden transition-colors duration-200"
                            >
                                <div className="h-32 w-full bg-neutral-100 overflow-hidden">
                                    {project.imageUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="font-semibold text-sm">
                                        {project.title || " "}
                                    </p>
                                    <p className="text-xs text-neutral-500 font-sans mt-1">
                                        {project.author
                                            ? `by ${project.author}`
                                            : " "}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── SUBSCRIBE ───────────────────────────────────────────── */}
            <section
                className={`bg-cream flex flex-col items-center justify-center px-6 py-24 gap-6 ${serif.className}`}
            >
                <motion.div
                    {...fadeIn()}
                    className="flex flex-col items-center gap-6 w-full"
                >
                    <h2 className="text-3xl md:text-4xl text-center">
                        Stay in the loop.
                    </h2>
                    <Subscribe />
                    <Link
                        href="/contact"
                        className="text-sm text-crimson hover:underline font-sans mt-2"
                    >
                        Questions? Contact us →
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </>
    );
}
