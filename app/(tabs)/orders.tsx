// Orders Screen - Displays order history from SQLite database
// Demonstrates advanced on-device data persistence (SQLite)
// Orders are loaded directly from the local database, not just Redux state

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { loadOrders } from '../../src/store/slices/ordersSlice';
import { colors, spacing, typography, borderRadius } from '../../src/utils/theme';

export default function OrdersScreen() {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((state) => state.orders);

  // Load orders from SQLite database on screen mount
  useEffect(() => {
    dispatch(loadOrders());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'shipped':
        return colors.primary;
      case 'delivered':
        return colors.success;
      default:
        return colors.warning;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'shipped':
        return 'airplane';
      case 'delivered':
        return 'checkbox';
      default:
        return 'time';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.orderCount}>{orders.length} orders</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={64} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing.md }}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              {/* Order header */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Ionicons
                    name={getStatusIcon(item.status) as any}
                    size={14}
                    color={getStatusColor(item.status)}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Order items summary */}
              <View style={styles.orderItems}>
                {item.items.slice(0, 2).map((cartItem, index) => (
                  <Text key={index} style={styles.itemText} numberOfLines={1}>
                    {cartItem.quantity}x {cartItem.product.title}
                  </Text>
                ))}
                {item.items.length > 2 && (
                  <Text style={styles.moreItems}>+{item.items.length - 2} more items</Text>
                )}
              </View>

              {/* Order footer */}
              <View style={styles.orderFooter}>
                <Text style={styles.paymentMethod}>
                  <Ionicons
                    name={item.paymentMethod === 'card' ? 'card' : 'logo-bitcoin'}
                    size={14}
                    color={colors.textMuted}
                  />{' '}
                  {item.paymentMethod === 'card' ? 'Card Payment' : 'Crypto Payment'}
                </Text>
                <Text style={styles.orderTotal}>£{item.total.toFixed(2)}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.orderNumber}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  orderCount: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderNumber: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  orderDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  moreItems: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  paymentMethod: {
    ...typography.caption,
    color: colors.textMuted,
  },
  orderTotal: {
    ...typography.h3,
    color: colors.primary,
  },
});
