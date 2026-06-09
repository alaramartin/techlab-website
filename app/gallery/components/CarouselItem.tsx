import { serif } from "@/app/ui/fonts";

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
        <div className="bg-white border border-neutral-200 m-4 w-56 hover:border-neutral-400 transition-colors duration-200">
            <div className="h-36 w-full overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-100" />
                )}
            </div>
            <div className="px-4 py-3">
                <p className={`text-sm ${serif.className}`}>{title}</p>
                <p className="text-xs text-neutral-500 italic font-sans mt-1">{author}</p>
                {description && (
                    <p className="text-xs text-neutral-600 font-sans mt-2">{description}</p>
                )}
            </div>
        </div>
    );
}
