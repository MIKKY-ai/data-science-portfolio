// BlockCart Constants
// API endpoints, category mappings, and app-wide configuration

export const API_BASE_URL = 'https://fakestoreapi.com';

// Luxury product categories - high-end fashion and accessories
export const CATEGORIES = [
  { id: 'bags', name: 'Bags', icon: 'bag-handle-outline' },
  { id: 'shoes', name: 'Shoes', icon: 'footsteps-outline' },
  { id: 'watches', name: 'Watches', icon: 'watch-outline' },
  { id: 'clothing', name: 'Clothing', icon: 'shirt-outline' },
];

// Polygon Amoy Testnet configuration for blockchain verification
export const BLOCKCHAIN_CONFIG = {
  rpcUrl: 'https://rpc-amoy.polygon.technology',
  chainId: 80002,
  networkName: 'Polygon Amoy Testnet',
  // Placeholder contract address - would be deployed before demo
  contractAddress: '0x0000000000000000000000000000000000000000',
};

// AsyncStorage keys for data persistence
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@blockcart_token',
  USER_DATA: '@blockcart_user',
  CART_DATA: '@blockcart_cart',
  ONBOARDED: '@blockcart_onboarded',
  PREFERENCES: '@blockcart_preferences',
  PRODUCTS_CACHE: '@blockcart_products_cache',
};
