import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Save, Camera, LogOut, Shield, Upload, Image, Database, Download, FileUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Product, AdminProduct, ProductCategory } from '../types/Product';
import { ImageUploader } from './ImageUploader';
import { getImageStorageInfo } from '../utils/imageUpload';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: AdminProduct) => void;
  onUpdateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  onDeleteProduct: (id: string) => void;
  onLogout: () => void;
  getStorageStats?: () => any;
  exportProducts?: () => string;
  importProducts?: (data: string) => Promise<boolean>;
  clearAllProducts?: () => Promise<boolean>;
}

export function AdminPanel({ 
  isOpen, 
  onClose, 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onLogout,
  getStorageStats,
  exportProducts,
  importProducts,
  clearAllProducts
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [showStorageInfo, setShowStorageInfo] = useState(false);
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

  // Update storage stats when component mounts or products change
  React.useEffect(() => {
    if (getStorageStats) {
      setStorageStats(getStorageStats());
    }
  }, [products, getStorageStats]);

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

  const handleImageUploadError = (error: string) => {
    alert(`Image upload failed: ${error}`);
  };
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
    
    console.log('Form submitted with data:', formData);
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Product description is required');
      return;
    }
    
    if (formData.price <= 0) {
      alert('Product price must be greater than 0');
      return;
    }
    
    if (formData.images.length === 0) {
      alert('At least one product image is required');
      return;
    }
    
    // Process the form data
    const productData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      subcategory: formData.subcategory?.trim() || undefined,
      tags: formData.tags.filter(tag => tag.trim() !== ''),
    };
    
    console.log('Processed product data:', productData);
    
    // Handle async operations properly
    const handleOperation = async () => {
      try {
        let success = false;
        
        if (editingProduct) {
          success = await onUpdateProduct(editingProduct.id, productData);
          if (success) {
            alert('Product updated successfully!');
          }
        } else {
          success = await onAddProduct(productData);
          if (success) {
            alert('Product added successfully!');
          }
        }
        
        if (success) {
          resetForm();
          setActiveTab('list');
          // Update storage stats
          if (getStorageStats) {
            setStorageStats(getStorageStats());
          }
        }
      } catch (error) {
        console.error('Error in form submission:', error);
        alert('An error occurred. Please try again.');
      }
    };
    
    handleOperation();
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

  const handleExport = () => {
    if (exportProducts) {
      try {
        const data = exportProducts();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shri-hari-products-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Products exported successfully!');
      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export products.');
      }
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && importProducts) {
        try {
          const text = await file.text();
          const success = await importProducts(text);
          if (success) {
            alert('Products imported successfully!');
            if (getStorageStats) {
              setStorageStats(getStorageStats());
            }
          }
        } catch (error) {
          console.error('Import error:', error);
          alert('Failed to import products.');
        }
      }
    };
    input.click();
  };

  const handleClearAll = async () => {
    if (clearAllProducts && confirm('Are you sure you want to delete ALL products? This action cannot be undone.')) {
      try {
        const success = await clearAllProducts();
        if (success) {
          alert('All products cleared successfully!');
          if (getStorageStats) {
            setStorageStats(getStorageStats());
          }
        }
      } catch (error) {
        console.error('Clear all error:', error);
        alert('Failed to clear products.');
      }
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
              {/* Storage Stats Button */}
              <button
                onClick={() => setShowStorageInfo(!showStorageInfo)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                <Database size={16} />
                <span>Storage</span>
              </button>
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
          
          {/* Storage Information Panel */}
          {showStorageInfo && storageStats && (
            <div className="mt-4 p-4 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-700 animate-fadeIn">
              {/* Image Storage Info */}
              <div className="mb-4 p-3 bg-purple-900 bg-opacity-20 rounded border border-purple-700">
                <h4 className="text-sm font-semibold text-purple-400 mb-2">📸 Image Storage</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{getImageStorageInfo().count}</div>
                    <div className="text-purple-300">Uploaded Images</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{getImageStorageInfo().estimatedSizeMB}MB</div>
                    <div className="text-purple-300">Storage Used</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{storageStats.totalProducts}</div>
                  <div className="text-xs text-blue-300">Total Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{storageStats.remainingSlots}</div>
                  <div className="text-xs text-green-300">Remaining Slots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{storageStats.utilizationPercentage}%</div>
                  <div className="text-xs text-yellow-300">Storage Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{storageStats.storageUsed}</div>
                  <div className="text-xs text-purple-300">Data Size</div>
                </div>
              </div>
              
              {/* Storage Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 text-sm"
                >
                  <Download size={14} />
                  <span>Export All</span>
                </button>
                <button
                  onClick={handleImport}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 text-sm"
                >
                  <FileUp size={14} />
                  <span>Import</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 text-sm"
                >
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              </div>
              
              {/* Storage Warning */}
              {storageStats.utilizationPercentage > 80 && (
                <div className="mt-3 p-2 bg-yellow-900 bg-opacity-20 rounded border border-yellow-700 flex items-center space-x-2">
                  <AlertCircle size={16} className="text-yellow-400" />
                  <span className="text-yellow-300 text-sm">Storage is {storageStats.utilizationPercentage}% full. Consider exporting and clearing old products.</span>
                </div>
              )}
              
              {/* Storage Success */}
              {storageStats.utilizationPercentage <= 50 && (
                <div className="mt-3 p-2 bg-green-900 bg-opacity-20 rounded border border-green-700 flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-green-300 text-sm">Storage is healthy. You can add {storageStats.remainingSlots} more products.</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'list'
                  ? 'bg-red-600 text-white shadow-lg netflix-glow'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Product List ({products.length}/{storageStats?.maxProducts || 2000})
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
              Add Product {storageStats && `(${storageStats.remainingSlots} slots left)`}
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
                          const handleDelete = async () => {
                            const success = await onDeleteProduct(product.id);
                            if (success && getStorageStats) {
                              setStorageStats(getStorageStats());
                            }
                          };
                          handleDelete();
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
                      <img src={image} alt={`Product ${index + 1}`} className="w-16 h-16 object-cover rounded-lg border border-gray-600" />
                      <div className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                        {image.startsWith('data:') ? `Uploaded Image ${index + 1}` : `Image ${index + 1} (URL)`}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded transition-all duration-200 transform hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Image Upload Component */}
                  <div className="mb-4">
                    <ImageUploader
                      onImageUploaded={handleImageUploaded}
                      onError={handleImageUploadError}
                    />
                  </div>
                  
                  {/* URL input for adding images */}
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-sm text-gray-400 mb-3">Or add image from URL:</p>
                  <div className="flex space-x-2">
                    <input
                      id="url-input"
                      type="url"
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const url = (e.target as HTMLInputElement).value;
                          if (url) {
                            setFormData(prev => ({
                              ...prev,
                              images: [...prev.images, url]
                            }));
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('url-input') as HTMLInputElement;
                        const url = input?.value;
                        if (url) {
                          setFormData(prev => ({
                            ...prev,
                            images: [...prev.images, url]
                          }));
                          input.value = '';
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <Image size={16} />
                      <span>Add Image</span>
                    </button>
                  </div>
                  </div>
                  
                  <div className="mt-2 p-3 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-700">
                    <p className="text-xs text-blue-300">
                      💡 <strong>Tip:</strong> Upload images directly from your computer or use URLs from services like Pexels, Unsplash.
                      Uploaded images are stored locally in your browser.
                    </p>
                  </div>
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
                  className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl netflix-glow min-w-[200px]"
                >
                  <Save size={20} />
                  <span>{editingProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className="px-8 py-4 border-2 border-gray-600 rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 text-gray-300 hover:text-white font-semibold min-w-[120px]"
                >
                  CANCEL
                </button>
              </div>
              
              {/* Form validation reminder */}
              <div className="mt-4 p-4 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-700">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">📋 Before submitting:</h4>
                <ul className="text-xs text-blue-300 space-y-1">
                  <li>✓ Product name and description are filled</li>
                  <li>✓ Price is set (greater than 0)</li>
                  <li>✓ At least one image URL is added</li>
                  <li>✓ Sizes and colors are selected</li>
                  <li>✓ Storage space available: {storageStats?.remainingSlots || 'Unknown'} slots remaining</li>
                </ul>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}