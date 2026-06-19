'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JobImageGalleryProps {
  images: string[];
  alt: string;
}

export default function JobImageGallery({ images, alt }: JobImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback to default image if none provided
  const list = images.length > 0 ? images : ['/image-copy-3.png'];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative group w-full max-w-[280px] sm:max-w-[320px] mx-auto border border-slate-200 rounded-none overflow-hidden shadow-sm bg-white aspect-[3/4] flex items-center justify-center">
      {/* Slides */}
      <div className="w-full h-full relative flex items-center justify-center p-2 bg-slate-50">
        <img
          src={list[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-all duration-500 ease-in-out"
        />
      </div>

      {/* Navigation Arrows (only show if multiple images) */}
      {list.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 border border-slate-100 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 border border-slate-100 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots Indicator (only show if multiple images) */}
      {list.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm z-10">
          {list.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer focus:outline-none ${
                currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Count Indicator */}
      {list.length > 1 && (
        <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/50 text-white z-10 select-none">
          {currentIndex + 1} / {list.length}
        </div>
      )}
    </div>
  );
}
