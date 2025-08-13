import React from 'react';
import { ImageSearchResult } from '../../types';

interface ImageResultsProps {
  images: ImageSearchResult[];
  title?: string;
  maxImages?: number;
  onImageClick?: (image: ImageSearchResult) => void;
}

const ImageResults: React.FC<ImageResultsProps> = ({ 
  images, 
  title = "Related Images", 
  maxImages = 6,
  onImageClick 
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  const displayImages = images.slice(0, maxImages);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-text-light mb-3 flex items-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {title}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displayImages.map((image, index) => (
          <div 
            key={index}
            className="group relative bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => onImageClick?.(image)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={image.image.src}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDEzMCAxMDBDMTMwIDExNi41NjkgMTE2LjU2OSAxMzAgMTAwIDEzMEM4My40MzEgMTMwIDcwIDExNi41NjkgNzAgMTAwQzcwIDgzLjQzMSA4My40MzEgNzAgMTAwIDcwWiIgZmlsbD0iIzkNQTM5QiIvPgo8L3N2Zz4K';
                }}
              />
            </div>
            
            <div className="p-2">
              <h4 className="text-xs font-medium text-text-light line-clamp-1 mb-1">
                {image.title}
              </h4>
              <p className="text-xs text-text-dark line-clamp-1">
                {image.snippet}
              </p>
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {images.length > maxImages && (
        <div className="text-center mt-3">
          <p className="text-xs text-text-dark">
            Showing {maxImages} of {images.length} images
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageResults;
