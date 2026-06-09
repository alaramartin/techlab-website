import NavBar from "../components/NavBar";
import Timeline from "./components/Timeline";
import { serif } from "@/app/ui/fonts";

export default function ProgramsPage() {
    return (
        <>
            <NavBar />
            <div className="px-16 pt-32 pb-24">
                <div className={serif.className}>
                    <h1 className="text-5xl mb-3">Our Programs</h1>
                    <p className="text-sm text-neutral-600 font-sans max-w-lg">
                        We run programs year-round in Palo Alto to support local
                        elementary schoolers&apos; coding journeys! See some of
                        our current and previous events below.
                    </p>
                </div>
                <div className="mt-16">
                    <Timeline />
                </div>
            </div>
        </>
    );
}
