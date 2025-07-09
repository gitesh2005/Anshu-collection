import React, { useState } from 'react';
import { Search, Menu, X, User, Phone, MessageCircle, LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onAdminToggle: () => void;
  onContactToggle: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  isAuthenticated?: boolean;
  onAdminLogout?: () => void;
}

export function Header({ 
  onSearch, 
  onCategoryChange, 
  onAdminToggle,
  onContactToggle,
  currentView,
  onViewChange,
  isAuthenticated = false,
  onAdminLogout
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const categories = [
    { key: 'all', label: 'All Products' },
    { key: 'sarees', label: 'Sarees' },
    { key: 'suits', label: 'Suits' },
    { key: 'kurtis', label: 'Kurtis' },
  ];

  return (
    <header className="bg-black shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-black/95 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 border-b border-gray-800">
          <div className="flex items-center">
            <button
              className="md:hidden mr-3 hover:bg-gray-800 p-2 rounded-lg transition-all duration-200 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 
              className="text-2xl font-bold text-red-500 cursor-pointer hover:text-red-400 transition-colors duration-200 transform hover:scale-105 netflix-glow"
              onClick={() => onViewChange('home')}
            >
              Shri Hari Collection
            </h1>
          </div>

          {/* Search bar - hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 group-hover:border-red-400 text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <button
              onClick={onContactToggle}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg netflix-glow"
            >
              <MessageCircle size={16} className="animate-pulse" />
              <span className="hidden sm:inline">Contact Us</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 hover:bg-gray-800 rounded-lg">
              <User size={20} />
            </button>
            
            {/* Admin Button with Authentication Status */}
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <button
                  onClick={onAdminLogout}
                  className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
                  title="Logout from Admin"
                >
                  <LogOut size={16} />
                </button>
              )}
              <button
                onClick={onAdminToggle}
                className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                  isAuthenticated 
                    ? 'bg-green-600 text-white hover:bg-green-700 netflix-glow' 
                    : 'bg-red-600 text-white hover:bg-red-700 netflix-glow'
                }`}
              >
                <Shield size={16} />
                <span>{isAuthenticated ? 'Admin Panel' : 'Admin Login'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${isMenuOpen ? 'block animate-fadeIn' : 'hidden'} md:block py-4`}>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-8">
            {categories.map((category, index) => (
              <button
                key={category.key}
                onClick={() => {
                  onCategoryChange(category.key);
                  onViewChange('products');
                  setIsMenuOpen(false);
                }}
                className={`text-gray-300 hover:text-red-500 transition-all duration-200 font-medium relative group transform hover:scale-105 ${
                  currentView === 'products' ? 'text-red-500' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {category.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden mt-4 animate-slideDown">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
            </div>
          </form>

          <div className="md:hidden mt-4 space-y-2 animate-slideDown">
            <button
              onClick={onContactToggle}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
            >
              <MessageCircle size={16} />
              <span>Contact Us</span>
            </button>
            
            {/* Mobile Admin Button */}
            <div className="flex space-x-2">
              {isAuthenticated && (
                <button
                  onClick={onAdminLogout}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
              <button
                onClick={onAdminToggle}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isAuthenticated 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <Shield size={16} />
                <span>{isAuthenticated ? 'Admin Panel' : 'Admin Login'}</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}