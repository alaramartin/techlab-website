import NavBar from "../components/NavBar";
import Carousel from "./components/Carousel";

export default function GalleryPage() {
    return (
        <>
            <NavBar />
            <div className="flex flex-col ml-24 mt-30 w-full">
                <div className="w-1/3">
                    <p>Project Gallery</p>
                    <p className="text-pretty">
                        View our students&apos; work from past workshops! Our
                        curriculum culminates in a final project for students to
                        demonstrate their learning.
                    </p>
                </div>
                <div className="mt-16">
                    <p>2026 Game Lab</p>
                    <div className="flex justify-center w-4/5 overflow-hidden translate-x-1/24">
                        {/* this translate-1/24 number is random and just looked right tbh */}
                        <Carousel />
                    </div>
                </div>
            </div>
        </>
    );
}
