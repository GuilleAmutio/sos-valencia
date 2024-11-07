import { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";

interface ImageCarouselProps {
  images: string[];
  onImageClick?: (url: string) => void;
  className?: string;
}

export default function ImageCarousel({ images, onImageClick, className = '' }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
  });

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative w-full rounded-lg overflow-hidden shadow-md ${className}`}>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {images.map((url, index) => (
            <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
              <img 
                src={url} 
                alt={`Image ${index + 1}`}
                className="w-full h-[250px] object-contain bg-gray-100 cursor-pointer"
                onClick={() => onImageClick?.(url)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            onClick={() => emblaApi?.scrollPrev()}
          >
            <ChevronLeftIcon />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            onClick={() => emblaApi?.scrollNext()}
          >
            <ChevronRightIcon />
          </button>
        </>
      )}
    </div>
  );
} 