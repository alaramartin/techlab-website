interface CarouselItemProps {
    image: string;
    projectName: string;
    authorName: string;
}

export default function CarouselItem({
    image,
    projectName,
    authorName,
}: CarouselItemProps) {
    return (
        <div className="border-2 rounded-2xl border-gray-300 p-4 m-6 hover:scale-115 transition-transform duration-200">
            <div className="flex border rounded-xl border-gray-300 w-60 h-30 mb-2 justify-center items-center">
                {image}
            </div>
            <p>{projectName}</p>
            <p className="text-gray-500 text-sm italic">{authorName}</p>
        </div>
    );
}
