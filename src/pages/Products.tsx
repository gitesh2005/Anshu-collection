import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Product, ProductCategory } from '../types/Product';
import { ProductCard } from '../components/ProductCard';

interface ProductsProps {
  products: Product[];
  onProductDetails: (product: Product) => void;
  onContactForProduct: (product: Product) => void;
  selectedCategory: string;
  searchQuery: string;
}

export function Products({ 
  products, 
  onProductDetails, 
  onContactForProduct,
  selectedCategory, 
  searchQuery 
}: ProductsProps) {
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'newest'>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by stock status
    if (stockFilter === 'in-stock') {
      filtered = filtered.filter(product => product.inStock);
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter(product => !product.inStock);
    }

    // Sort products
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy, priceRange, stockFilter]);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Products' },
    { key: 'sarees', label: 'Sarees' },
    { key: 'suits', label: 'Suits' },
    { key: 'kurtis', label: 'Kurtis' },
  ];

  const maxPrice = Math.max(...products.map(p => p.price));

  return (
    <div className="min-h-screen netflix-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {selectedCategory === 'all' 
                ? searchQuery 
                  ? `Search Results for "${searchQuery}"` 
                  : 'Our Complete Collection'
                : categories.find(c => c.key === selectedCategory)?.label || 'Products'
              }
            </h1>
            <p className="text-gray-400">
              {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  viewMode === 'grid' 
                    ? 'bg-red-600 text-white shadow-lg netflix-glow' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  viewMode === 'list' 
                    ? 'bg-red-600 text-white shadow-lg netflix-glow' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <List size={20} />
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 text-white"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block animate-slideInLeft' : 'hidden'} md:block w-64 space-y-6`}>
            <div className="netflix-card-gradient p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Stock Status</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Products' },
                  { value: 'in-stock', label: 'In Stock' },
                  { value: 'out-of-stock', label: 'Out of Stock' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors duration-200">
                    <input
                      type="radio"
                      name="stock"
                      value={option.value}
                      checked={stockFilter === option.value}
                      onChange={(e) => setStockFilter(e.target.value as any)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="netflix-card-gradient p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16 animate-fadeIn">
                <div className="text-gray-600 mb-4">
                  <Filter size={64} className="mx-auto animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
              }`}>
                {filteredAndSortedProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-popUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard
                      product={product}
                      onViewDetails={onProductDetails}
                      onContactForProduct={onContactForProduct}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}