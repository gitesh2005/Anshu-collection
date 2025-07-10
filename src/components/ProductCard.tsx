import React, { useState } from 'react';
import { MessageCircle, Eye, Phone } from 'lucide-react';
import { Product } from '../types/Product';
import { ImageDisplay } from './ImageDisplay';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onContactForProduct: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails, onContactForProduct }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="netflix-card-gradient rounded-lg shadow-md overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 border border-gray-700 netflix-glow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <ImageDisplay
          src={product.images[0]}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold animate-bounce netflix-glow">
            {discountPercentage}% OFF
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-semibold text-lg animate-pulse">Out of Stock</span>
          </div>
        )}
        <div className={`absolute top-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button
            onClick={() => onViewDetails(product)}
            className="p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition-all duration-200 transform hover:scale-110 netflix-glow"
          >
            <Eye size={16} />
          </button>
        </div>
        
        {/* Floating action buttons */}
        <div className={`absolute bottom-3 right-3 flex flex-col space-y-2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => onContactForProduct(product)}
            className="p-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-110 animate-pulse netflix-glow"
          >
            <MessageCircle size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-red-500 font-semibold uppercase tracking-wide animate-fadeIn">
            {product.category}
          </span>
          <div className="flex items-center space-x-2">
            {product.inStock ? (
              <span className="text-xs text-green-400 font-semibold uppercase tracking-wide bg-green-900 px-2 py-1 rounded-full animate-pulse">
                In Stock
              </span>
            ) : (
              <span className="text-xs text-red-400 font-semibold uppercase tracking-wide bg-red-900 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-200">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border-2 border-gray-600 transform hover:scale-125 transition-transform duration-200"
                style={{ 
                  backgroundColor: color.toLowerCase(),
                  animationDelay: `${index * 100}ms`
                }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-400 animate-bounce">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-400">
            Sizes: {product.sizes.slice(0, 3).join(', ')}
            {product.sizes.length > 3 && '...'}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-red-600 text-red-500 rounded-lg hover:bg-red-900 hover:bg-opacity-20 transition-all duration-200 transform hover:scale-105"
          >
            <Eye size={16} />
            <span className="text-sm font-medium">View Details</span>
          </button>
          <button
            onClick={() => onContactForProduct(product)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg netflix-glow"
          >
            <MessageCircle size={16} className="animate-pulse" />
            <span className="text-sm font-medium">Inquire</span>
          </button>
        </div>
      </div>
    </div>
  );
}