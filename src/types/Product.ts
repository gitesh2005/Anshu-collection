export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 
  | 'sarees' 
  | 'suits' 
  | 'kurtis';

export interface AdminProduct {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
}

export interface ContactInfo {
  whatsappNumber: string;
  businessName: string;
  email: string;
  address: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}