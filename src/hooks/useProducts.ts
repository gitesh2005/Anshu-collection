import { useState, useEffect } from 'react';
import { Product, AdminProduct, ProductCategory } from '../types/Product';
import { sampleProducts } from '../data/products';
import { resolveImageUrl } from '../utils/imageUpload';

// Storage configuration for large datasets
const STORAGE_CONFIG = {
  MAX_PRODUCTS: 2000,
  CHUNK_SIZE: 100, // Process products in chunks
  STORAGE_KEY: 'shri_hari_products',
  BACKUP_KEY: 'shri_hari_products_backup',
  METADATA_KEY: 'shri_hari_metadata'
};

// Metadata interface for tracking storage info
interface StorageMetadata {
  totalProducts: number;
  lastUpdated: string;
  version: string;
  storageSize: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState<StorageMetadata | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products from storage...');
      
      // Check storage metadata first
      const metadata = getStorageMetadata();
      setStorageInfo(metadata);
      
      const savedProducts = localStorage.getItem(STORAGE_CONFIG.STORAGE_KEY);
      
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          
          if (Array.isArray(parsed)) {
            // Ensure all images are properly resolved
            const resolvedProducts = parsed.map(product => ({
              ...product,
              images: product.images.map((img: string) => resolveImageUrl(img)),
              createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt),
              updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt)
            }));
            console.log(`Loaded ${parsed.length} products from storage`);
            setProducts(resolvedProducts);
          } else {
            console.warn('Saved products is not an array, using sample products');
            await initializeWithSampleProducts();
          }
        } catch (parseError) {
          console.error('Error parsing saved products:', parseError);
          await initializeWithSampleProducts();
        }
      } else {
        console.log('No saved products found, initializing with sample products');
        await initializeWithSampleProducts();
      }
    } catch (error) {
      console.error('Error loading products:', error);
      await initializeWithSampleProducts();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithSampleProducts = async () => {
    try {
      setProducts(sampleProducts);
      await saveProducts(sampleProducts);
    } catch (error) {
      console.error('Error initializing with sample products:', error);
      setProducts(sampleProducts);
    }
  };

  const getStorageMetadata = (): StorageMetadata | null => {
    try {
      const metadata = localStorage.getItem(STORAGE_CONFIG.METADATA_KEY);
      return metadata ? JSON.parse(metadata) : null;
    } catch (error) {
      console.error('Error reading storage metadata:', error);
      return null;
    }
  };

  const updateStorageMetadata = (products: Product[]) => {
    try {
      const metadata: StorageMetadata = {
        totalProducts: products.length,
        lastUpdated: new Date().toISOString(),
        version: '1.0',
        storageSize: new Blob([JSON.stringify(products)]).size
      };
      
      localStorage.setItem(STORAGE_CONFIG.METADATA_KEY, JSON.stringify(metadata));
      setStorageInfo(metadata);
    } catch (error) {
      console.error('Error updating storage metadata:', error);
    }
  };

  const saveProducts = async (newProducts: Product[]): Promise<boolean> => {
    try {
      console.log(`Saving ${newProducts.length} products to storage...`);
      
      // Check if we're exceeding the maximum product limit
      if (newProducts.length > STORAGE_CONFIG.MAX_PRODUCTS) {
        console.warn(`Product limit exceeded. Maximum allowed: ${STORAGE_CONFIG.MAX_PRODUCTS}`);
        alert(`Maximum product limit (${STORAGE_CONFIG.MAX_PRODUCTS}) exceeded. Please remove some products first.`);
        return false;
      }

      // Create backup before saving
      const currentProducts = localStorage.getItem(STORAGE_CONFIG.STORAGE_KEY);
      if (currentProducts) {
        localStorage.setItem(STORAGE_CONFIG.BACKUP_KEY, currentProducts);
      }

      // Optimize product data before saving (remove unnecessary fields for storage)
      const optimizedProducts = newProducts.map(product => ({
        ...product,
        // Ensure dates are properly serialized
        createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
        updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt
      }));

      // Save products
      const productsJson = JSON.stringify(optimizedProducts);
      localStorage.setItem(STORAGE_CONFIG.STORAGE_KEY, productsJson);
      
      // Update metadata
      updateStorageMetadata(newProducts);
      
      // Update state
      setProducts(newProducts);
      
      console.log(`✅ Successfully saved ${newProducts.length} products`);
      
      // Check storage usage
      const storageUsed = new Blob([productsJson]).size;
      const storageUsedMB = (storageUsed / (1024 * 1024)).toFixed(2);
      console.log(`Storage used: ${storageUsedMB} MB`);
      
      if (storageUsed > 5 * 1024 * 1024) { // 5MB warning
        console.warn('Storage usage is high. Consider optimizing product data.');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving products:', error);
      
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please remove some products or clear browser data.');
        
        // Try to restore from backup
        try {
          const backup = localStorage.getItem(STORAGE_CONFIG.BACKUP_KEY);
          if (backup) {
            localStorage.setItem(STORAGE_CONFIG.STORAGE_KEY, backup);
            console.log('Restored from backup due to storage quota error');
          }
        } catch (backupError) {
          console.error('Error restoring from backup:', backupError);
        }
      } else {
        alert('Error saving product. Please try again.');
      }
      
      return false;
    }
  };

  const addProduct = async (adminProduct: AdminProduct): Promise<boolean> => {
    console.log('Adding product:', adminProduct);
    
    // Validate input
    if (!adminProduct.name?.trim()) {
      alert('Product name is required');
      return false;
    }
    
    if (!adminProduct.description?.trim()) {
      alert('Product description is required');
      return false;
    }
    
    if (!adminProduct.price || adminProduct.price <= 0) {
      alert('Product price must be greater than 0');
      return false;
    }
    
    if (!adminProduct.images || adminProduct.images.length === 0) {
      alert('At least one product image is required');
      return false;
    }

    // Check product limit before adding
    if (products.length >= STORAGE_CONFIG.MAX_PRODUCTS) {
      alert(`Cannot add more products. Maximum limit of ${STORAGE_CONFIG.MAX_PRODUCTS} reached.`);
      return false;
    }
    
    try {
      const newProduct: Product = {
        ...adminProduct,
        id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Ensure all required fields have default values
        subcategory: adminProduct.subcategory || '',
        originalPrice: adminProduct.originalPrice || undefined,
        tags: adminProduct.tags || [],
        sizes: adminProduct.sizes || [],
        colors: adminProduct.colors || []
      };
      
      console.log('New product created:', newProduct);
      
      const updatedProducts = [newProduct, ...products];
      console.log(`Updated products array: ${updatedProducts.length} total products`);
      
      const success = await saveProducts(updatedProducts);
      
      if (success) {
        // Verify the product was added
        setTimeout(() => {
          const savedProducts = localStorage.getItem(STORAGE_CONFIG.STORAGE_KEY);
          if (savedProducts) {
            const currentProducts = JSON.parse(savedProducts);
            const addedProduct = currentProducts.find((p: Product) => p.id === newProduct.id);
            if (addedProduct) {
              console.log('✅ Product successfully added and verified');
            } else {
              console.error('❌ Product verification failed');
            }
          }
        }, 100);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in addProduct:', error);
      alert('Failed to add product. Please try again.');
      return false;
    }
  };

  const updateProduct = async (id: string, updates: Partial<AdminProduct>): Promise<boolean> => {
    try {
      const updatedProducts = products.map(product =>
        product.id === id
          ? { 
              ...product, 
              ...updates, 
              updatedAt: new Date(),
              // Ensure dates are properly handled
              createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt)
            }
          : product
      );
      
      return await saveProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const updatedProducts = products.filter(product => product.id !== id);
      return await saveProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
      return false;
    }
  };

  const clearAllProducts = async (): Promise<boolean> => {
    try {
      const success = await saveProducts([]);
      if (success) {
        console.log('All products cleared');
      }
      return success;
    } catch (error) {
      console.error('Error clearing products:', error);
      return false;
    }
  };

  const exportProducts = (): string => {
    try {
      return JSON.stringify(products, null, 2);
    } catch (error) {
      console.error('Error exporting products:', error);
      return '';
    }
  };

  const importProducts = async (productsJson: string): Promise<boolean> => {
    try {
      const importedProducts = JSON.parse(productsJson);
      
      if (!Array.isArray(importedProducts)) {
        alert('Invalid product data format');
        return false;
      }
      
      if (importedProducts.length > STORAGE_CONFIG.MAX_PRODUCTS) {
        alert(`Cannot import ${importedProducts.length} products. Maximum limit is ${STORAGE_CONFIG.MAX_PRODUCTS}.`);
        return false;
      }
      
      // Validate and normalize imported products
      const validProducts = importedProducts.map((product, index) => ({
        ...product,
        id: product.id || `imported_${Date.now()}_${index}`,
        createdAt: product.createdAt ? new Date(product.createdAt) : new Date(),
        updatedAt: new Date()
      }));
      
      return await saveProducts(validProducts);
    } catch (error) {
      console.error('Error importing products:', error);
      alert('Failed to import products. Please check the data format.');
      return false;
    }
  };

  const getProductsByCategory = (category: ProductCategory) => {
    return products.filter(product => product.category === category);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  const searchProducts = (query: string) => {
    if (!query.trim()) return products;
    
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(lowercaseQuery)) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getStorageStats = () => {
    const productsJson = JSON.stringify(products);
    const sizeInBytes = new Blob([productsJson]).size;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    
    return {
      totalProducts: products.length,
      maxProducts: STORAGE_CONFIG.MAX_PRODUCTS,
      remainingSlots: STORAGE_CONFIG.MAX_PRODUCTS - products.length,
      storageUsed: `${sizeInMB} MB`,
      storageUsedBytes: sizeInBytes,
      utilizationPercentage: ((products.length / STORAGE_CONFIG.MAX_PRODUCTS) * 100).toFixed(1)
    };
  };

  return {
    products,
    loading,
    storageInfo,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    exportProducts,
    importProducts,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,
    getStorageStats,
    reloadProducts: loadProducts
  };
}