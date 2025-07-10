import React, { useState } from 'react';
import { X, MessageCircle, Share2, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { Product } from '../types/Product';
import { ImageDisplay } from './ImageDisplay';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onContactForProduct: (product: Product) => void;
}

export function ProductDetail({ product, onClose, onContactForProduct }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="netflix-card-gradient rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{product.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <ImageDisplay
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full shadow-md hover:bg-opacity-70"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full shadow-md hover:bg-opacity-70"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <ImageDisplay
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                        index === currentImageIndex ? 'ring-2 ring-red-500' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <span className="text-sm text-red-500 font-semibold uppercase tracking-wide">
                  {product.category}
                  {product.subcategory && ` • ${product.subcategory}`}
                </span>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-3xl font-bold text-white">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                      <span className="px-2 py-1 bg-red-900 bg-opacity-20 text-red-400 text-sm font-semibold rounded">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  {product.inStock ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 bg-opacity-20 text-green-400">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900 bg-opacity-20 text-red-400">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">{product.description}</p>

              {/* Available Sizes */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Available Sizes</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-300"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Colors */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Available Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-300"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-4">
                <button
                  onClick={() => onContactForProduct(product)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors netflix-glow"
                >
                  <MessageCircle size={20} />
                  <span>Contact for This Product</span>
                </button>
                
                <div className="flex space-x-4">
                  <button className="flex-1 p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
                    <Share2 size={20} className="mx-auto" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}