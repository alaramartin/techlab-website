interface CarouselItemProps {
    title: string;
    author: string;
    imageUrl: string;
    description: string;
}

export default function CarouselItem({
    title,
    author,
    imageUrl,
    description,
}: CarouselItemProps) {
    return (
        <div className="border-2 rounded-2xl border-gray-300 p-4 m-6 hover:scale-110 transition-transform duration-200">
            <div className="flex border rounded-xl border-gray-300 w-75 h-37 mb-2 justify-center items-center overflow-hidden">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <p className="text-md">{title}</p>
            <p className="text-gray-500 text-sm italic">{author}</p>
            {description && <p>{description}</p>}
        </div>
    );
}
