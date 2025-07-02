import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Save, Camera, LogOut, Shield } from 'lucide-react';
import { Product, AdminProduct, ProductCategory } from '../types/Product';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: AdminProduct) => void;
  onUpdateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  onDeleteProduct: (id: string) => void;
  onLogout: () => void;
}

export function AdminPanel({ 
  isOpen, 
  onClose, 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onLogout
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<AdminProduct>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    images: [],
    category: 'sarees',
    subcategory: '',
    sizes: [],
    colors: [],
    inStock: true,
    featured: false,
    tags: [],
  });

  const categories: ProductCategory[] = ['sarees', 'suits', 'kurtis'];
  const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', '32', '34', '36', '38', '40', '42'];
  const commonColors = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Black', 'White', 'Brown', 'Gold', 'Silver'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      images: [],
      category: 'sarees',
      subcategory: '',
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      tags: [],
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, formData);
    } else {
      onAddProduct(formData);
    }
    resetForm();
    setActiveTab('list');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      sizes: product.sizes,
      colors: product.colors,
      inStock: product.inStock,
      featured: product.featured,
      tags: product.tags,
    });
    setActiveTab('edit');
  };

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleTagsChange = (tags: string) => {
    setFormData(prev => ({
      ...prev,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout from admin panel?')) {
      onLogout();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="netflix-card-gradient rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden animate-slideInUp border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                <p className="text-sm text-green-400">Authenticated Session</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-110 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'list'
                  ? 'bg-red-600 text-white shadow-lg netflix-glow'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Product List ({products.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('add');
                resetForm();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'add'
                  ? 'bg-red-600 text-white shadow-lg netflix-glow'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="p-6 h-full overflow-y-auto">
          {activeTab === 'list' && (
            <div className="space-y-4">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="border border-gray-700 rounded-lg p-4 flex items-center space-x-4 hover:shadow-md transition-all duration-200 animate-fadeInUp netflix-card-gradient"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="text-sm text-gray-400">{product.category}</p>
                    <p className="text-lg font-bold text-red-500">₹{product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.inStock
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {product.featured && (
                      <span className="px-2 py-1 text-xs bg-red-900 text-red-300 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-400 hover:bg-blue-900 hover:bg-opacity-20 rounded transition-all duration-200 transform hover:scale-110"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this product?')) {
                          onDeleteProduct(product.id);
                        }
                      }}
                      className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded transition-all duration-200 transform hover:scale-110"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'add' || activeTab === 'edit') && (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl animate-fadeIn">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Original Price (₹) - Optional
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) || undefined }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subcategory (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subcategory || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Images
                </label>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2 animate-fadeIn">
                      <img src={image} alt={`Product ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = e.target.value;
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded transition-all duration-200 transform hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleImageAdd}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 text-gray-300"
                  >
                    <Camera size={16} />
                    <span>Add Image URL</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-1 border rounded-md text-sm transition-all duration-200 transform hover:scale-105 ${
                        formData.sizes.includes(size)
                          ? 'border-red-500 bg-red-900 bg-opacity-20 text-red-400 shadow-md'
                          : 'border-gray-700 hover:border-gray-600 text-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorToggle(color)}
                      className={`px-3 py-1 border rounded-md text-sm transition-all duration-200 transform hover:scale-105 ${
                        formData.colors.includes(color)
                          ? 'border-red-500 bg-red-900 bg-opacity-20 text-red-400 shadow-md'
                          : 'border-gray-700 hover:border-gray-600 text-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="wedding, silk, traditional, handwoven"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded border-gray-700 text-red-600 focus:ring-red-500 transition-all duration-200"
                  />
                  <span className="text-sm font-medium text-gray-300">In Stock</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-700 text-red-600 focus:ring-red-500 transition-all duration-200"
                  />
                  <span className="text-sm font-medium text-gray-300">Featured Product</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg netflix-glow"
                >
                  <Save size={16} />
                  <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}