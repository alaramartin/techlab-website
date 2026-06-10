import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Timeline from "./components/Timeline";
import { serif } from "@/app/ui/fonts";

export default function ProgramsPage() {
    return (
        <>
            <NavBar />
            <div className="pt-32 pb-24">
                <div className={`${serif.className} px-6 md:px-16`}>
                    <h1 className="text-5xl md:text-6xl mb-4">
                        Our Programs
                    </h1>
                    <p className="text-sm text-neutral-600 font-sans max-w-lg leading-relaxed">
                        We run programs year-round in Palo Alto to support local
                        elementary schoolers&apos; coding journeys! See some of
                        our current and previous events below.
                    </p>
                </div>
                <div className="mt-12">
                    <Timeline />
                </div>
            </div>
            <Footer />
        </>
    );
}
