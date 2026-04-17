// Root Layout - Entry point for Expo Router navigation
// Wraps entire app with Redux Provider and handles auth-based routing
// Restores persisted session and cart data on app launch

import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { store, useAppDispatch } from '../src/store';
import { restoreSession } from '../src/store/slices/authSlice';
import { restoreCart } from '../src/store/slices/cartSlice';
import { initDatabase } from '../src/store/slices/ordersSlice';
import { colors } from '../src/utils/theme';

// Inner component that has access to Redux store
function RootLayoutInner() {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Restore persisted data on app launch
    const init = async () => {
      try {
        await dispatch(initDatabase());
      } catch (e) {
        console.log('SQLite init skipped (web or error):', e);
      }
      try {
        await dispatch(restoreSession());
        await dispatch(restoreCart());
      } catch (e) {
        console.log('Session restore error:', e);
      }
      setIsReady(true);
    };
    init();
  }, [dispatch]);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="checkout" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

// Root component wraps everything with Redux Provider
export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutInner />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
