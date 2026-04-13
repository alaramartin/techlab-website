"use client";
import NavBar from "@/app/components/NavBar";
import { useState } from "react";

interface GalleryItem {
    id: number;
    title: string;
    description: string;
}

export default function GalleryPage() {
    const [isHovering, setIsHovering] = useState(false);
    const [scrollOffset, setScrollOffset] = useState(0);
    
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        setScrollOffset(prev => prev + e.deltaX);
    };
    
    const galleryItems: GalleryItem[] = [
        {
            id: 1,
            title: "Gallery Item 1",
            description: "Add your image and description here"
        },
        {
            id: 2,
            title: "Gallery Item 2",
            description: "Add your image and description here"
        },
        {
            id: 3,
            title: "Gallery Item 3",
            description: "Add your image and description here"
        },
        {
            id: 4,
            title: "Gallery Item 4",
            description: "Add your image and description here"
        },
        {
            id: 5,
            title: "Gallery Item 5",
            description: "Add your image and description here"
        },
    ];
    
    // Triplicate items for smooth infinite loop
    const triplicatedItems = [...galleryItems, ...galleryItems, ...galleryItems];
    
    return (
        <>
            <NavBar />
            
            {/* Page Title Section */}
            <div className="w-full mt-20 px-4 md:px-8" style={{ marginLeft: '60px' }}>
                <h1 className="text-5xl md:text-6xl font-bold mb-2" style={{ color: 'var(--color-gold)' }}>
                    Gallery
                </h1>
                <p className="text-lg mb-12" style={{ color: 'var(--color-pink-soft)' }}>
                    Explore our collection of work and inspiration
                </p>
            </div>

            {/* Auto-Scrolling Gallery Section */}
            <div 
                className="w-full px-4 md:px-8 mb-20 relative"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onWheel={handleWheel}
            >
                {/* Carousel Container */}
                <div className="relative overflow-visible rounded-lg">
                    {/* Animated Track */}
                    <div 
                        className={`flex gap-6 py-4 ${isHovering ? 'animation-paused' : ''}`}
                        style={{
                            animation: `scroll-left 30s linear infinite`,
                            animationPlayState: isHovering ? 'paused' : 'running',
                            transform: `translateX(${scrollOffset}px)`,
                            paddingLeft: '80px',
                        }}
                    >
                        {triplicatedItems.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="flex-shrink-0 w-96 transition-transform duration-300 transform hover:scale-110 hover:z-20 group"
                            >
                                {/* Card */}
                                <div 
                                    className="rounded-lg overflow-hidden border-2 transition-all duration-300 h-full shadow-lg hover:shadow-2xl"
                                    style={{
                                        backgroundColor: 'var(--bg-card)',
                                        borderColor: 'var(--color-pink)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-gold)';
                                        e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 209, 102, 0.8), 0 0 80px rgba(255, 209, 102, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-pink)';
                                        e.currentTarget.style.boxShadow = '';
                                    }}
                                >
                                    
                                    {/* Image Placeholder */}
                                    <div 
                                        className="w-full h-64 flex items-center justify-center border-b-2"
                                        style={{
                                            backgroundColor: 'var(--bg-primary)',
                                            borderColor: 'var(--color-pink)',
                                        }}
                                    >
                                        <div className="text-center">
                                            <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Image Placeholder</p>
                                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Replace with image</p>
                                        </div>
                                    </div>
                                    
                                    {/* Card Content */}
                                    <div className="p-8" style={{ backgroundColor: 'rgba(225, 138, 173, 0.6)' }}>
                                        <h3 className="text-xl font-bold mb-2 transition-colors group-hover:opacity-80" style={{ color: 'var(--color-gold)' }}>
                                            {item.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                            {item.description}
                                        </p>
                                        
                                        {/* Learn More Button */}
                                        <a
                                            href="#"
                                            className="inline-block mt-4 px-4 py-2 font-semibold text-sm rounded transition-all duration-300"
                                            style={{
                                                backgroundColor: 'var(--color-gold)',
                                                color: 'var(--bg-primary)',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gold-dark)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gold)'}
                                        >
                                            Learn More →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Fade Edges - Solid Color */}
                    <div className="fixed pointer-events-none z-50" style={{ left: '0', top: '0', bottom: '0', width: '50px', backgroundColor: 'rgba(13, 13, 13, 0.8)' }}></div>
                    <div className="fixed pointer-events-none z-50" style={{ right: '0', top: '0', bottom: '0', width: '50px', backgroundColor: 'rgba(13, 13, 13, 0.8)' }}></div>
                </div>
            </div>

            {/* Gallery Description Section */}
            <div className="w-full px-4 md:px-8 py-12 mb-12" style={{ marginLeft: '60px' }}>
                <div className="max-w-4xl">
                    <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--color-pink-soft)' }}>About This Gallery</h2>
                    <p className="text-lg p-8 rounded-lg" style={{ backgroundColor: 'rgba(225, 138, 173, 0.6)', color: 'var(--text-main)' }}>
                        A paragraph/general description about the projects.
                    </p>
                </div>
            </div>
        </>
    );
}
