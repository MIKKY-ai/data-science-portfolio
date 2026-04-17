// Product Detail Screen - Shows full product information
// Features: image, price, description, rating, blockchain verification, add to cart
// Uses expo-haptics for tactile feedback on add to cart action

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppDispatch, useAppSelector } from '../../../src/store';
import { addToCart } from '../../../src/store/slices/cartSlice';
import { verifyProduct } from '../../../src/store/slices/verificationSlice';
import VerificationModal from '../../../src/components/blockchain/VerificationModal';
import Button from '../../../src/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '../../../src/utils/theme';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const product = useAppSelector((state) =>
    state.products.items.find((p) => p.id === Number(id))
  );
  const { isVerifying, results } = useAppSelector((state) => state.verification);
  const [showVerification, setShowVerification] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </SafeAreaView>
    );
  }

  const verificationResult = product.blockchainHash
    ? results[product.blockchainHash]
    : null;

  // Add product to cart with haptic feedback (platform-specific feature)
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Trigger blockchain verification for this product
  const handleVerify = () => {
    if (product.blockchainHash) {
      setShowVerification(true);
      dispatch(verifyProduct({ productId: product.id, hash: product.blockchainHash }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={handleVerify}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category.toUpperCase()}</Text>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.primary} />
              <Text style={styles.rating}>
                {product.rating.rate} ({product.rating.count} reviews)
              </Text>
            </View>
          </View>

          {/* Blockchain verification status */}
          <TouchableOpacity style={styles.verifyBanner} onPress={handleVerify}>
            <Ionicons
              name={verificationResult?.isVerified ? 'shield-checkmark' : 'shield-outline'}
              size={20}
              color={verificationResult?.isVerified ? colors.success : colors.primary}
            />
            <Text style={styles.verifyText}>
              {verificationResult?.isVerified
                ? 'Verified Authentic on Blockchain'
                : 'Tap to Verify Authenticity'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Description */}
          <Text style={styles.descLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quantity selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.descLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>£{(product.price * quantity).toFixed(2)}</Text>
        </View>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          style={{ flex: 1 }}
        />
      </View>

      {/* Blockchain verification modal */}
      <VerificationModal
        visible={showVerification}
        onClose={() => setShowVerification(false)}
        isVerifying={isVerifying}
        isVerified={verificationResult?.isVerified ?? null}
        productName={product.title}
        hash={product.blockchainHash}
      />
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
  imageContainer: {
    height: 300,
    backgroundColor: '#fff',
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  categoryBadge: {
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  categoryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  price: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  verifyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verifyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  descLabel: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyText: {
    ...typography.h3,
    color: colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  totalSection: {
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  totalPrice: {
    ...typography.h3,
    color: colors.text,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
