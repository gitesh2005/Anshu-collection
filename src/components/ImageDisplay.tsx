import React, { useState, useEffect } from 'react';
import { resolveImageUrl } from '../utils/imageUpload';

interface ImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  onClick?: () => void;
}

export function ImageDisplay({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
  onError,
  onClick
}: ImageDisplayProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        console.log(`🔍 Loading image: ${src}`);
        
        // Resolve the image URL (handles global-image:// URLs)
        const resolvedUrl = resolveImageUrl(src);
        
        console.log(`✅ Resolved to: ${resolvedUrl.substring(0, 50)}...`);
        
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
      console.warn(`❌ Image failed to load: ${src}`);
      setHasError(true);
      setImageSrc(fallbackSrc);
      if (onError) onError();
    }
  };

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully: ${src}`);
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
      onClick={onClick}
      loading="lazy"
    />
  );
}