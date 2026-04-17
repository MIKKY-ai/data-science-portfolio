// Cart Slice - Manages shopping cart state with full CRUD operations
// Cart data is persisted to AsyncStorage via custom middleware

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Restores cart data from AsyncStorage on app launch
export const restoreCart = createAsyncThunk('cart/restoreCart', async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.CART_DATA);
  return data ? (JSON.parse(data) as CartItem[]) : [];
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add a product to cart or increase quantity if already present
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.product.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    // Remove an item from cart entirely
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },
    // Update quantity of a specific cart item
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.product.id !== action.payload.productId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    // Clear all items from cart (used after successful checkout)
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors for computed cart values
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
