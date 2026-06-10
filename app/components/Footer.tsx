import Link from "next/link";
import { serif } from "../ui/fonts";
import Subscribe from "./Subscribe";

const footerLinks = [
    { title: "Project Gallery", link: "/gallery" },
    { title: "Our Programs", link: "/programs" },
    { title: "Contact Us", link: "/contact" },
];

const Footer = () => {
    return (
        <footer className="bg-crimson text-white">
            <div className="px-6 md:px-16 pt-16 md:pt-20 pb-14">
                <p
                    className={`${serif.className} text-3xl md:text-5xl leading-tight max-w-3xl`}
                >
                    Girls belong in tech.{" "}
                    <span className="text-white/70">
                        We help get them started.
                    </span>
                </p>

                <div className="mt-14 grid gap-12 md:grid-cols-3">
                    <div>
                        <p className={`${serif.className} text-xl`}>
                            Girls in Tech Lab
                        </p>
                        <p className="mt-3 text-sm font-sans text-white/70 leading-relaxed max-w-xs">
                            Student-run coding programs for girls in Palo Alto,
                            California.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-sans text-white/60 mb-4">
                            Explore
                        </p>
                        <div className="flex flex-col gap-2.5 font-sans text-sm">
                            {footerLinks.map((item) => (
                                <Link
                                    key={item.link}
                                    href={item.link}
                                    className="w-fit hover:opacity-70 transition-opacity duration-150"
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-sans text-white/60 mb-4">
                            Stay in the loop
                        </p>
                        <Subscribe dark />
                    </div>
                </div>
            </div>

            <div className="border-t border-white/20 px-6 md:px-16 py-5 flex flex-col md:flex-row gap-2 justify-between text-xs font-sans text-white/60">
                <span>
                    © {new Date().getFullYear()} Girls in Tech Lab
                </span>
                <span>Palo Alto, California</span>
            </div>
        </footer>
    );
};

export default Footer;
