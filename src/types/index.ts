// BlockCart Type Definitions
// Defines all TypeScript interfaces used throughout the application

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  blockchainHash?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentMethod: 'card' | 'crypto';
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface VerificationResult {
  productId: number;
  productHash: string;
  isVerified: boolean;
  timestamp: string;
  blockchainNetwork: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  apiCategory?: string;
}
