// Persistence Middleware - Syncs Redux state changes to AsyncStorage
// This custom middleware listens for cart actions and persists cart state automatically
// Demonstrates understanding of Redux middleware pattern

import { Middleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constants';

export const persistenceMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  // Persist cart state whenever a cart action is dispatched
  if (action.type?.startsWith('cart/') && !action.type.includes('restoreCart')) {
    const cartState = store.getState().cart;
    AsyncStorage.setItem(STORAGE_KEYS.CART_DATA, JSON.stringify(cartState.items));
  }

  return result;
};
