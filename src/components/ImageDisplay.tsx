import React, { useState } from 'react';

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
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      if (onError) onError();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const imageSrc = hasError ? fallbackSrc : src;

  if (isLoading && !hasError) {
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