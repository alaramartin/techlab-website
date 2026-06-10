import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ContactForm from "./components/ContactForm";
import { serif } from "@/app/ui/fonts";

export default function ContactPage() {
    return (
        <>
            <NavBar />
            <div className="px-6 md:px-16 pt-32 pb-24">
                <div className={serif.className}>
                    <h1 className="text-5xl md:text-6xl mb-4">
                        Contact Us
                    </h1>
                    <p className="text-sm text-neutral-600 font-sans max-w-lg leading-relaxed">
                        Questions about our programs, partnerships, or getting
                        involved? Send us a message and we&apos;ll get back to
                        you as soon as we can.
                    </p>
                </div>
                <div className="mt-16 max-w-xl">
                    <ContactForm />
                </div>
            </div>
            <Footer />
        </>
    );
}
