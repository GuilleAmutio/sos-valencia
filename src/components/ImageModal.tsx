"use client";

import React, { useEffect } from 'react';
import Portal from './Portal';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  useEffect(() => {
    if (imageUrl) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [imageUrl]);

  if (!imageUrl) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/80 z-[9999]"
        onClick={onClose}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <img 
            src={imageUrl} 
            alt="Expanded view"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button 
            onClick={onClose}
            className="fixed top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Portal>
  );
} 