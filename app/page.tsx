import NavBar from "./components/NavBar";

export default function Page() {
    return (
        <>
            <NavBar />
            <div className="justify-center text-center mt-20 bg-black h-120" />
            <div className="absolute left-20 top-100 text-white items-center z-100 h-full w-full">
                name of program and short description
            </div>
            <p>longer paragraph description about the program</p>
        </>
    );
}
