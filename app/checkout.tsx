// Checkout Screen - Handles order placement with shipping and payment
// Creates order in SQLite database, clears cart, and provides confirmation
// Demonstrates REST API write operations and SQLite persistence

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppDispatch, useAppSelector } from '../src/store';
import { clearCart, selectCartTotal } from '../src/store/slices/cartSlice';
import { createOrder } from '../src/store/slices/ordersSlice';
import { fakeStoreApi } from '../src/services/api/fakeStoreApi';
import Button from '../src/components/ui/Button';
import Input from '../src/components/ui/Input';
import { ShippingAddress } from '../src/types';
import { colors, spacing, typography, borderRadius } from '../src/utils/theme';

export default function CheckoutScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const total = useAppSelector(selectCartTotal);
  const user = useAppSelector((state) => state.auth.user);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    addressLine1: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
  });

  const handlePlaceOrder = async () => {
    // Validate shipping address
    if (!address.fullName || !address.addressLine1 || !address.city || !address.postcode) {
      Alert.alert('Missing Information', 'Please fill in all shipping address fields.');
      return;
    }

    setIsProcessing(true);

    try {
      // POST cart to Fake Store API - demonstrates REST write operation
      await fakeStoreApi.post('/carts', {
        userId: user?.id || 1,
        date: new Date().toISOString().split('T')[0],
        products: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      // Save order to SQLite database - demonstrates advanced persistence
      await dispatch(
        createOrder({
          items: cartItems,
          total,
          paymentMethod,
          shippingAddress: address,
        })
      ).unwrap();

      // Clear the cart after successful order
      dispatch(clearCart());

      // Haptic feedback for successful order
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        'Order Placed!',
        'Your order has been confirmed. You can track it in the Orders tab.',
        [
          {
            text: 'View Orders',
            onPress: () => {
              router.dismiss();
              setTimeout(() => router.push('/(tabs)/orders'), 100);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Shipping address form */}
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.formSection}>
            <Input
              label="Full Name"
              value={address.fullName}
              onChangeText={(text) => setAddress({ ...address, fullName: text })}
              placeholder="Enter your full name"
              autoCapitalize="words"
            />
            <Input
              label="Address Line 1"
              value={address.addressLine1}
              onChangeText={(text) => setAddress({ ...address, addressLine1: text })}
              placeholder="Street address"
            />
            <Input
              label="City"
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
              placeholder="City"
            />
            <Input
              label="Postcode"
              value={address.postcode}
              onChangeText={(text) => setAddress({ ...address, postcode: text })}
              placeholder="Postcode"
            />
          </View>

          {/* Payment method selection */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod('card')}
            >
              <Ionicons
                name="card"
                size={24}
                color={paymentMethod === 'card' ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.paymentLabel,
                  paymentMethod === 'card' && styles.paymentLabelActive,
                ]}
              >
                Card Payment
              </Text>
              <Text style={styles.paymentSubtext}>Visa, Mastercard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'crypto' && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod('crypto')}
            >
              <Ionicons
                name="logo-bitcoin"
                size={24}
                color={paymentMethod === 'crypto' ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.paymentLabel,
                  paymentMethod === 'crypto' && styles.paymentLabelActive,
                ]}
              >
                Crypto
              </Text>
              <Text style={styles.paymentSubtext}>ETH, MATIC</Text>
            </TouchableOpacity>
          </View>

          {/* Order summary */}
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            {cartItems.map((item) => (
              <View key={item.product.id} style={styles.summaryItem}>
                <Text style={styles.summaryItemName} numberOfLines={1}>
                  {item.quantity}x {item.product.title}
                </Text>
                <Text style={styles.summaryItemPrice}>
                  £{(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>£{total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>Free</Text>
            </View>
            <View style={[styles.summaryItem, styles.totalItem]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>£{total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Place order button */}
        <View style={styles.bottomBar}>
          <Button
            title={`Pay £${total.toFixed(2)}`}
            onPress={handlePlaceOrder}
            isLoading={isProcessing}
          />
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  formSection: {
    marginBottom: spacing.sm,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  paymentOption: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(201, 168, 76, 0.05)',
  },
  paymentLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  paymentLabelActive: {
    color: colors.primary,
  },
  paymentSubtext: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryItemName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.md,
  },
  summaryItemPrice: {
    ...typography.bodySmall,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.text,
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  totalLabel: {
    ...typography.h3,
    color: colors.text,
  },
  totalValue: {
    ...typography.h3,
    color: colors.primary,
  },
  bottomBar: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
