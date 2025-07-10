import React, { useEffect, useState } from 'react';
import { Star, Truck, Shield, RotateCcw, ArrowRight, MessageCircle, Phone, Sparkles, Heart, Award, Users } from 'lucide-react';
import { Product } from '../types/Product';
import { ProductCard } from '../components/ProductCard';
import { ImageDisplay } from '../components/ImageDisplay';

interface HomeProps {
  featuredProducts: Product[];
  onProductDetails: (product: Product) => void;
  onContactForProduct: (product: Product) => void;
  onViewAllProducts: () => void;
  onContactToggle: () => void;
}

export function Home({ 
  featuredProducts, 
  onProductDetails, 
  onContactForProduct, 
  onViewAllProducts,
  onContactToggle 
}: HomeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all scroll-animate elements
    const animateElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
    animateElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-red-800"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 opacity-10 rounded-full animate-float blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-400 opacity-15 rounded-full animate-float-delayed blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-red-600 opacity-10 rounded-full animate-float blur-2xl"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-500 opacity-15 rounded-full animate-float-delayed blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-red-500 opacity-5 rounded-full animate-float transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          {/* Brand Logo/Icon */}
          <div className="flex items-center justify-center mb-8 animate-zoomIn">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl netflix-glow">
                <Heart className="text-white" size={40} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="text-yellow-800" size={16} />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 animate-popUp netflix-glow">
              <span className="bg-gradient-to-r from-red-400 via-pink-500 to-red-600 bg-clip-text text-transparent">
                Shri Hari
              </span>
            </h1>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-200 animate-popUpDelayed animation-delay-300">
              Collection
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-fadeInUp animation-delay-600">
            Where <span className="text-red-400 font-semibold">Tradition</span> meets <span className="text-pink-400 font-semibold">Elegance</span>
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto animate-fadeInUp animation-delay-800">
            Discover our exquisite collection of handcrafted sarees, designer suits, and elegant kurtis. 
            Each piece tells a story of timeless beauty and cultural heritage.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slideInUp animation-delay-1000">
            <button
              onClick={onViewAllProducts}
              className="group relative inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl netflix-glow overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Explore Collection</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button
              onClick={onContactToggle}
              className="group inline-flex items-center justify-center space-x-3 bg-transparent border-2 border-green-500 hover:bg-green-500 text-green-400 hover:text-white px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <MessageCircle size={20} className="animate-pulse group-hover:animate-none" />
              <span>WhatsApp Us</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-fadeInUp animation-delay-1200">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">500+</div>
              <div className="text-gray-400 text-sm md:text-base">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">100+</div>
              <div className="text-gray-400 text-sm md:text-base">Unique Designs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">5★</div>
              <div className="text-gray-400 text-sm md:text-base">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Experience the perfect blend of quality, authenticity, and customer service</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Award, 
                title: 'Premium Quality', 
                desc: 'Handpicked premium fabrics and materials sourced from the finest weavers', 
                color: 'text-red-500',
                bgColor: 'bg-red-900/20',
                delay: '0ms' 
              },
              { 
                icon: MessageCircle, 
                title: 'Instant Support', 
                desc: 'WhatsApp us for instant product inquiries and personalized assistance', 
                color: 'text-green-500',
                bgColor: 'bg-green-900/20',
                delay: '100ms' 
              },
              { 
                icon: Heart, 
                title: 'Handcrafted', 
                desc: 'Each piece is carefully crafted with love and attention to detail', 
                color: 'text-pink-500',
                bgColor: 'bg-pink-900/20',
                delay: '200ms' 
              },
              { 
                icon: Shield, 
                title: 'Authentic', 
                desc: '100% genuine and authentic ethnic wear with quality guarantee', 
                color: 'text-purple-500',
                bgColor: 'bg-purple-900/20',
                delay: '300ms' 
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group text-center hover:transform hover:scale-105 transition-all duration-500 scroll-animate-scale"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`${feature.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 border border-gray-700 group-hover:border-gray-600`}>
                  <feature.icon className={`${feature.color} group-hover:scale-110 transition-transform duration-300`} size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-red-400 transition-colors duration-300 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Redesigned (Removed Lehengas) */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Collections</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Explore our diverse range of traditional and contemporary ethnic wear</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
                title: 'Sarees',
                subtitle: 'Timeless Elegance',
                delay: '0ms',
                description: 'Discover our exquisite collection of handwoven sarees, featuring traditional motifs and premium silk fabrics perfect for weddings and special occasions.'
              },
              { 
                image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
                title: 'Suits',
                subtitle: 'Modern Grace',
                delay: '100ms',
                description: 'Elegant designer suits with intricate embroidery and comfortable fits, including matching dupattas for party wear and celebrations.'
              },
              { 
                image: 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg',
                title: 'Kurtis',
                subtitle: 'Casual Comfort',
                delay: '200ms',
                description: 'Comfortable cotton kurtis with modern designs, perfect for daily wear, office, and casual outings with matching palazzo pants.'
              }
            ].map((category, index) => (
              <div 
                key={index}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-700 hover:shadow-2xl netflix-glow ${
                  index % 2 === 0 ? 'scroll-animate-left' : 'scroll-animate-right'
                }`}
                style={{ animationDelay: category.delay }}
                onClick={onViewAllProducts}
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-red-400 text-sm font-medium mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {category.subtitle}
                      </p>
                      <h3 className="text-white text-2xl font-bold mb-2">
                        {category.title}
                      </h3>
                      <div className="w-12 h-1 bg-red-500 group-hover:w-20 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div className="scroll-animate-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Collection</h2>
              <p className="text-xl text-gray-400">Handpicked pieces that define elegance</p>
            </div>
            <button
              onClick={onViewAllProducts}
              className="text-red-500 hover:text-red-400 font-semibold flex items-center space-x-2 group transition-all duration-300 scroll-animate-right bg-red-900/20 px-6 py-3 rounded-full hover:bg-red-900/30"
            >
              <span>View All</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <div 
                key={product.id}
                className="scroll-animate-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  onViewDetails={onProductDetails}
                  onContactForProduct={onContactForProduct}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-red-900 via-black to-red-800 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white opacity-5 rounded-full animate-float blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-300 opacity-10 rounded-full animate-float-delayed blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-400 opacity-10 rounded-full animate-float blur-lg"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Contact info */}
            <div className="scroll-animate-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Have questions about our collection? We're here to help you find the perfect outfit for your special moments.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-gray-300">+91 88168 31181</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-300">88168 31181</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - CTA */}
            <div className="text-center lg:text-left scroll-animate-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-4">Ready to Shop?</h3>
                <p className="text-gray-300 mb-6">
                  Contact us directly via WhatsApp for instant assistance and personalized recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={onContactToggle}
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <MessageCircle size={20} className="animate-pulse" />
                    <span>WhatsApp Now</span>
                  </button>
                  <button
                    onClick={onViewAllProducts}
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}