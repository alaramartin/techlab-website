"use client";
import NavBar from "@/app/components/NavBar";
import { useState } from "react";

export default function Page() {
    const [currentImage, setCurrentImage] = useState(0);
    
    const images = [
        { id: 1, title: "Program 1" },
        { id: 2, title: "Program 2" },
        { id: 3, title: "Program 3" },
        { id: 4, title: "Program 4" },
        { id: 5, title: "Program 5" },
        { id: 6, title: "Program 6" },
    ];
    
    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };
    
    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };
    
    return (
        <>
            <NavBar />
            
            {/* Card Gallery Section */}
            <div className="w-full mt-20 px-4 md:px-8">
                <div className="relative h-96 rounded-lg shadow-lg overflow-hidden">
                    
                    {/* Image Placeholder Background */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <p style={{ color: 'var(--text-main)' }} className="text-4xl font-semibold mb-2">Image {currentImage + 1}</p>
                            <p style={{ color: 'var(--color-gold)' }} className="text-xl">{images[currentImage].title}</p>
                        </div>
                    </div>
                    
                    {/* Gradient Overlay - Black on sides, Pink in center */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-rose-300 to-black rounded-lg"></div>
                    
                    {/* Left Arrow */}
                    <button
                        onClick={prevImage}
                        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 transition-colors"
                        style={{ color: 'var(--color-gold)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold-dark)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
                        aria-label="Previous image"
                    >
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    {/* Right Arrow */}
                    <button
                        onClick={nextImage}
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 transition-colors"
                        style={{ color: 'var(--color-gold)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold-dark)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
                        aria-label="Next image"
                    >
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    {/* Dot Indicators */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImage(index)}
                                className="w-3 h-3 rounded-full transition-colors"
                                style={{
                                    backgroundColor: index === currentImage ? 'var(--color-gold)' : 'var(--bg-primary)'
                                }}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full px-4 md:px-8 py-12">
                <h1 className="text-5xl font-bold mb-8" style={{ color: 'var(--color-gold)' }}>About Us</h1>
                <p className="text-lg p-8 rounded-lg" style={{ backgroundColor: 'rgba(225, 138, 173, 0.6)', color: 'var(--text-main)', borderColor: 'var(--color-pink)', borderWidth: '1px' }}>
                    longer paragraph description about the program
                </p>
            </div>
        </>
    );
}

