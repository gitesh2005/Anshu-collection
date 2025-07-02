import { useState, useEffect } from 'react';
import { Product, AdminProduct, ProductCategory } from '../types/Product';
import { sampleProducts } from '../data/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from localStorage or API
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        setProducts(parsed);
      } catch (error) {
        console.error('Error parsing saved products:', error);
        setProducts(sampleProducts);
      }
    } else {
      setProducts(sampleProducts);
    }
    setLoading(false);
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const addProduct = (adminProduct: AdminProduct) => {
    const newProduct: Product = {
      ...adminProduct,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
  };

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    const updatedProducts = products.map(product =>
      product.id === id
        ? { ...product, ...updates, updatedAt: new Date() }
        : product
    );
    saveProducts(updatedProducts);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    saveProducts(updatedProducts);
  };

  const getProductsByCategory = (category: ProductCategory) => {
    return products.filter(product => product.category === category);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,
  };
}