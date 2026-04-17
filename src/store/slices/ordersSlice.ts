// Orders Slice - Manages order history with SQLite persistence
// Demonstrates advanced on-device data persistence using SQLite database
// SQLite operations are wrapped in try/catch for web compatibility

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, CartItem, ShippingAddress } from '../../types';
import { Platform } from 'react-native';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
};

// Initialise SQLite database and create orders table if not exists
export const initDatabase = createAsyncThunk('orders/initDatabase', async () => {
  if (Platform.OS === 'web') return;
  const { initOrdersTable } = await import('../../services/storage/sqliteDb');
  await initOrdersTable();
});

// Load all orders from SQLite database
export const loadOrders = createAsyncThunk('orders/loadOrders', async () => {
  if (Platform.OS === 'web') return [];
  const { getAllOrders } = await import('../../services/storage/sqliteDb');
  const rows = await getAllOrders();

  return rows.map((row: any) => ({
    id: row.id,
    orderNumber: row.orderNumber,
    items: JSON.parse(row.items) as CartItem[],
    total: row.total,
    status: row.status as Order['status'],
    paymentMethod: row.paymentMethod as Order['paymentMethod'],
    shippingAddress: JSON.parse(row.shippingAddress) as ShippingAddress,
    createdAt: row.createdAt,
  }));
});

// Create a new order and persist it to SQLite
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({
    items,
    total,
    paymentMethod,
    shippingAddress,
  }: {
    items: CartItem[];
    total: number;
    paymentMethod: 'card' | 'crypto';
    shippingAddress: ShippingAddress;
  }) => {
    const orderNumber = 'BC-' + Date.now().toString(36).toUpperCase();
    const createdAt = new Date().toISOString();

    let insertId = Date.now();
    if (Platform.OS !== 'web') {
      const { insertOrder } = await import('../../services/storage/sqliteDb');
      const result = await insertOrder(
        orderNumber,
        JSON.stringify(items),
        total,
        'confirmed',
        paymentMethod,
        JSON.stringify(shippingAddress),
        createdAt
      );
      insertId = result.lastInsertRowId;
    }

    return {
      id: insertId,
      orderNumber,
      items,
      total,
      status: 'confirmed' as const,
      paymentMethod,
      shippingAddress,
      createdAt,
    };
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    });
  },
});

export default ordersSlice.reducer;
