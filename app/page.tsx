"use client";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import ScrollForMore from "./components/ScrollForMore";
import Footer from "./components/Footer";
import { serif } from "./ui/fonts";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { motion } from "motion/react";
import Subscribe from "./components/Subscribe";
import { fetchProgram, type Project } from "@/lib/projects";

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

const ease = [0.25, 0, 0, 1] as const;

const landingFade = (delay = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, delay, ease },
});

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, delay, ease },
});

export default function Page() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetchProgram(FEATURED_PROGRAM_ID).then((program) => {
            if (program) setProjects(program.projects.slice(0, 3));
        });
    }, []);

    return (
        <>
            <NavBar />
            <div
                id="scroll-root"
                className="snap-y snap-proximity h-screen overflow-y-auto"
            >
                {/* ─── LANDING ─────────────────────────────────────────────── */}
                <div
                    className={`w-full h-screen flex flex-row ${serif.className} snap-center`}
                >
                    <div className="w-7/12 h-full bg-black" />
                    <div className="flex w-5/12 h-full justify-center items-start flex-col px-16 gap-4">
                        <motion.p
                            {...landingFade(0.1)}
                            className="text-xs text-red-900 font-sans italic"
                        >
                            Based in Palo Alto
                        </motion.p>
                        <motion.p
                            {...landingFade(0.25)}
                            className="text-6xl leading-tight"
                        >
                            Girls belong in tech.
                        </motion.p>
                        <motion.p {...landingFade(0.4)} className="text-xl">
                            We help get them started.
                        </motion.p>
                        <ScrollForMore />
                    </div>
                </div>

                {/* ─── MISSION ─────────────────────────────────────────────── */}
                {/* <section
                    className={`min-h-screen flex flex-col md:flex-row ${serif.className} snap-center`}
                >
                    <motion.div
                        {...fadeIn()}
                        className="md:w-1/2 bg-neutral-100 relative min-h-[30vh] md:min-h-full overflow-hidden"
                    >
                        <Image
                            src="/workshop.jpg" 
                            alt="Workshop photo"
                            fill
                            className="object-cover grayscale"
                        />
                    </motion.div>

                    <motion.div
                        {...fadeIn(0.15)}
                        className="md:w-1/2 flex flex-col justify-center px-12 py-16 gap-6"
                    >
                        <p className="text-xs text-red-900 font-sans">
                            Why we exist
                        </p>
                        <h2 className="text-4xl md:text-5xl italic leading-tight"></h2>
                        <p className="text-base leading-relaxed text-neutral-600 max-w-md font-sans"></p>
                    </motion.div>
                </section> */}

                {/* ─── MOST RECENT EVENT ───────────────────────────────────── */}
                <section
                    className={`min-h-screen flex flex-col md:flex-row bg-black text-white ${serif.className} snap-center`}
                >
                    <motion.div
                        {...fadeIn(0.15)}
                        className="md:w-1/2 flex flex-col justify-center px-12 py-16 gap-6"
                    >
                        <p className="text-xs text-red-900 font-sans italic">
                            Our Mission
                        </p>
                        <h2 className="text-4xl md:text-5xl leading-tight">
                            Women hold fewer than 1 in 4 computing jobs.
                        </h2>
                        <p className="text-base leading-relaxed text-neutral-400 max-w-md font-sans">
                            As high school students in Palo Alto, we&apos;ve
                            seen the gap firsthand. We run events year-round to
                            help close it. Here is our most recent one.
                        </p>
                    </motion.div>

                    <motion.div
                        {...fadeIn()}
                        className="md:w-1/2 flex items-center justify-center py-16 px-12"
                    >
                        <div
                            className="w-full max-w-xs bg-black border border-neutral-700 relative"
                            style={{ aspectRatio: "1 / 1.414" }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="italic text-neutral-500 text-sm">
                                    poster
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ─── STUDENT PROJECTS ────────────────────────────────────── */}
                <section
                    className={`min-h-screen flex flex-col md:flex-row items-center px-12 py-20 gap-12 ${serif.className} snap-center`}
                >
                    <motion.div
                        {...fadeIn()}
                        className="md:w-2/5 flex flex-col gap-4 md:self-center"
                    >
                        <p className="text-xs text-red-900 font-sans italic">
                            Portfolio
                        </p>
                        <h2 className="text-4xl md:text-5xl leading-tight">
                            Our students do real work.
                        </h2>
                        <p className="text-base leading-relaxed text-neutral-600 max-w-md font-sans">
                            Here are some highlights.
                        </p>
                        <Link
                            href="/gallery"
                            className="inline-flex items-center gap-2 text-sm font-sans text-red-900 hover:gap-3 transition-all mt-4"
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
                                    className="absolute w-52 bg-white border border-neutral-200 hover:border-neutral-400 shadow-sm overflow-hidden transition-colors duration-200"
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
                                            {project.title || " "}
                                        </p>
                                        <p className="text-xs text-neutral-500 font-sans mt-1">
                                            {project.author
                                                ? `by ${project.author}`
                                                : " "}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── CONTACT / SUBSCRIBE ─────────────────────────────────── */}
                <section
                    className={`min-h-[50vh] bg-neutral-50 flex flex-col items-center justify-center px-4 py-20 gap-6 ${serif.className} snap-center`}
                >
                    <motion.div
                        {...fadeIn()}
                        className="flex flex-col items-center gap-6 w-full"
                    >
                        <Link
                            href="/contact"
                            className="text-sm text-red-900 hover:underline font-sans"
                        >
                            Questions? Contact us →
                        </Link>
                        <h2 className="text-3xl md:text-4xl text-center">
                            Stay in the loop.
                        </h2>
                        <Subscribe />
                    </motion.div>
                </section>
                <div className="snap-start [&>footer]:mt-0">
                    <Footer />
                </div>
            </div>
        </>
    );
}
