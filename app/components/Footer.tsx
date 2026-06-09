import Link from "next/link";
import { serif } from "../ui/fonts";
import Subscribe from "./Subscribe";

const Footer = () => {
    return (
        <footer
            className={`${serif.className} mt-60 md:px-30 pt-20 pb-16 border-t-2 bg-red-900 grid grid-cols-3 text-white`}
        >
            <div className="m-2 flex flex-col ml-6 justify-center">
                <p className="text-2xl">Girls in Tech Lab</p>
                <div className="flex flex-col ml-6 mt-2 space-y-2">
                    <Link
                        href="/gallery"
                        className="inline-block w-fit hover:opacity-80 transition-all duration-100"
                    >
                        Project Gallery
                    </Link>
                    <Link
                        href="/programs"
                        className="inline-block w-fit hover:opacity-80 transition-all duration-100"
                    >
                        Our Programs
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-block w-fit hover:opacity-80 transition-all duration-100"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
                <p className="text-base leading-relaxed max-w-xs">
                    Helping girls in Palo Alto get started in tech.
                </p>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Subscribe />
            </div>
        </footer>
    );
};

export default Footer;
