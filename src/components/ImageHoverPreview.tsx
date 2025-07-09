import React, { useState, useRef, useEffect } from 'react';

interface ImageHoverPreviewProps {
  src: string;
  alt: string;
  className?: string;
  previewClassName?: string;
}

export function ImageHoverPreview({ 
  src, 
  alt, 
  className = '', 
  previewClassName = '' 
}: ImageHoverPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const thumbnailRef = useRef<HTMLImageElement>(null);
  const previewRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isHovered && thumbnailRef.current) {
      const thumbnailRect = thumbnailRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate optimal preview size (max 80% of viewport)
      const maxWidth = viewportWidth * 0.8;
      const maxHeight = viewportHeight * 0.8;
      
      // Create temporary image to get natural dimensions
      const tempImg = new Image();
      tempImg.onload = () => {
        const naturalRatio = tempImg.naturalWidth / tempImg.naturalHeight;
        
        let previewWidth = Math.min(maxWidth, tempImg.naturalWidth);
        let previewHeight = previewWidth / naturalRatio;
        
        if (previewHeight > maxHeight) {
          previewHeight = maxHeight;
          previewWidth = previewHeight * naturalRatio;
        }
        
        // Position the preview to avoid viewport edges
        let x = thumbnailRect.left + thumbnailRect.width / 2 - previewWidth / 2;
        let y = thumbnailRect.top - previewHeight - 20; // 20px gap above thumbnail
        
        // Adjust if preview goes off-screen
        if (x < 20) x = 20;
        if (x + previewWidth > viewportWidth - 20) x = viewportWidth - previewWidth - 20;
        if (y < 20) y = thumbnailRect.bottom + 20; // Show below if no space above
        if (y + previewHeight > viewportHeight - 20) y = viewportHeight - previewHeight - 20;
        
        setPreviewPosition({ x, y });
        setPreviewSize({ width: previewWidth, height: previewHeight });
      };
      tempImg.src = src;
    }
  }, [isHovered, src]);

  return (
    <>
      <img
        ref={thumbnailRef}
        src={src}
        alt={alt}
        className={`cursor-pointer transition-all duration-300 hover:brightness-110 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      {isHovered && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 pointer-events-none z-[9998] animate-fadeIn"
            style={{ backdropFilter: 'blur(2px)' }}
          />
          
          {/* Preview Image */}
          <div
            className="fixed pointer-events-none z-[9999] animate-fadeIn"
            style={{
              left: `${previewPosition.x}px`,
              top: `${previewPosition.y}px`,
              width: `${previewSize.width}px`,
              height: `${previewSize.height}px`,
            }}
          >
            <img
              ref={previewRef}
              src={src}
              alt={`${alt} - Full Size`}
              className={`w-full h-full object-contain rounded-lg shadow-2xl border-2 border-white/20 ${previewClassName}`}
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))',
                animation: 'scaleIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            />
            
            {/* Subtle glow effect */}
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: 'linear-gradient(45deg, rgba(229, 9, 20, 0.1), rgba(229, 9, 20, 0.05))',
                boxShadow: '0 0 40px rgba(229, 9, 20, 0.3)'
              }}
            />
          </div>
        </>
      )}
    </>
  );
}