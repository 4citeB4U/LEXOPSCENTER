import React from 'react';
import { ImageSearchResult } from '../../types';
import { Image, Eye } from 'lucide-react';

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
    return (
      <div className="text-center py-8 text-text-dark">
        <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">No images available for this research topic</p>
      </div>
    );
  }

  const displayImages = images.slice(0, maxImages);

  return (
    <div className="mt-3">
      <h3 className="text-sm font-semibold text-text-light mb-3 flex items-center">
        <Image className="w-4 h-4 mr-2" />
        {title} ({displayImages.length})
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayImages.map((image, index) => (
          <div 
            key={index}
            className="group relative bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-700 hover:border-accent-fuchsia"
            onClick={() => onImageClick?.(image)}
          >
            <div className="aspect-square overflow-hidden bg-slate-700">
              <img
                src={image.image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDEzMCAxMDBDMTMwIDExNi41NjkgMTE2LjU2OSAxMzAgMTAwIDEzMEM4My40MzEgMTMwIDcwIDExNi41NjkgNzAgMTAwQzcwIDgzLjQzMSA4My40MzEgNzAgMTAwIDcwWiIgZmlsbD0iIzkNQTM5QiIvPgo8L3N2Zz4K';
                }}
              />
            </div>
            
            <div className="p-2">
              <h4 className="text-xs font-medium text-text-light line-clamp-2 mb-1 leading-tight">
                {image.title}
              </h4>
              <p className="text-xs text-text-dark line-clamp-2 leading-tight">
                {image.snippet}
              </p>
            </div>
            
            {/* Enhanced hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-3">
              <div className="text-center">
                <Eye className="w-5 h-5 text-white mx-auto mb-1" />
                <span className="text-white text-xs font-medium">View Image</span>
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
