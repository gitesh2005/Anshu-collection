import React, { useState, useEffect } from 'react';
import { resolveImageUrl } from '../utils/imageUpload';

interface ImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

export function ImageDisplay({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
  onError 
}: ImageDisplayProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Resolve the image URL (handles global-image:// URLs)
        const resolvedUrl = resolveImageUrl(src);
        setImageSrc(resolvedUrl);
      } catch (error) {
        console.error('Error resolving image URL:', error);
        setHasError(true);
        setImageSrc(fallbackSrc);
        if (onError) onError();
      } finally {
        setIsLoading(false);
      }
    };

    if (src) {
      loadImage();
    } else {
      setImageSrc(fallbackSrc);
      setIsLoading(false);
    }
  }, [src, fallbackSrc, onError]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      if (onError) onError();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-800 animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      loading="lazy"
    />
  );
}