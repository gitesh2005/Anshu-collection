import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProductDetail } from './components/ProductDetail';
import { ContactModal } from './components/ContactModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { useProducts } from './hooks/useProducts';
import { useAuth } from './hooks/useAuth';
import { Product } from './types/Product';

type View = 'home' | 'products' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [contactProduct, setContactProduct] = useState<Product | null>(null);

  const {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    searchProducts,
    getStorageStats,
    exportProducts,
    importProducts,
    clearAllProducts
  } = useProducts();

  const { isAuthenticated, login, logout } = useAuth();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('products');
    setSelectedCategory('all');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleContactForProduct = (product: Product) => {
    setContactProduct(product);
    setIsContactOpen(true);
  };

  const handleContactToggle = () => {
    setContactProduct(null);
    setIsContactOpen(!isContactOpen);
  };

  const handleViewAllProducts = () => {
    setCurrentView('products');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const handleAdminToggle = () => {
    if (isAuthenticated) {
      setIsAdminOpen(!isAdminOpen);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      login();
      setIsAdminOpen(true);
      setIsAdminLoginOpen(false);
    }
  };

  const handleAdminLogout = () => {
    logout();
    setIsAdminOpen(false);
  };

  const displayedProducts = searchQuery 
    ? searchProducts(searchQuery)
    : products;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onAdminToggle={handleAdminToggle}
        onContactToggle={handleContactToggle}
        currentView={currentView}
        onViewChange={setCurrentView}
        isAuthenticated={isAuthenticated}
        onAdminLogout={handleAdminLogout}
      />

      {currentView === 'home' && (
        <Home
          featuredProducts={getFeaturedProducts()}
          onProductDetails={handleProductDetails}
          onContactForProduct={handleContactForProduct}
          onViewAllProducts={handleViewAllProducts}
          onContactToggle={handleContactToggle}
        />
      )}

      {currentView === 'products' && (
        <Products
          products={displayedProducts}
          onProductDetails={handleProductDetails}
          onContactForProduct={handleContactForProduct}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onContactForProduct={handleContactForProduct}
        />
      )}

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          setContactProduct(null);
        }}
        selectedProduct={contactProduct}
      />

      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLogin={handleAdminLogin}
      />

      {isAuthenticated && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          products={products}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          onLogout={handleAdminLogout}
          getStorageStats={getStorageStats}
          exportProducts={exportProducts}
          importProducts={importProducts}
          clearAllProducts={clearAllProducts}
        />
      )}
    </div>
  );
}

export default App;