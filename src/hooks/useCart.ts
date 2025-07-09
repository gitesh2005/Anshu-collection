import { useState, useEffect } from 'react';
import { CartItem, Product } from '../types/Product';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (
    product: Product, 
    quantity: number = 1, 
    selectedSize?: string, 
    selectedColor?: string
  ) => {
    const existingItemIndex = cartItems.findIndex(
      item => 
        item.product.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      saveCart(updatedItems);
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        selectedSize,
        selectedColor,
      };
      saveCart([...cartItems, newItem]);
    }
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    const updatedItems = cartItems.filter(
      item => !(
        item.product.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      )
    );
    saveCart(updatedItems);
  };

  const updateQuantity = (
    productId: string, 
    quantity: number, 
    selectedSize?: string, 
    selectedColor?: string
  ) => {
    const updatedItems = cartItems.map(item =>
      item.product.id === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
        ? { ...item, quantity }
        : item
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };
}