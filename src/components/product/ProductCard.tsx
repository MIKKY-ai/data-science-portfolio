// Product Card component - displays product in a grid or list layout
// Used on Home screen and Category Listing screens

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types';
import { colors, borderRadius, spacing, typography } from '../../utils/theme';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  compact?: boolean;
}

export default function ProductCard({ product, onPress, compact = false }: ProductCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compact]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, compact && styles.compactImage]}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        {product.blockchainHash && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>£{product.price.toLocaleString('en-GB', { minimumFractionDigits: 0 })}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <Text style={styles.ratingText}>{product.rating.rate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    width: 170,
    marginRight: spacing.md,
  },
  compact: {
    width: '48%' as any,
    marginRight: 0,
    marginBottom: spacing.md,
  },
  imageContainer: {
    height: 170,
    backgroundColor: '#fff',
    padding: spacing.md,
    position: 'relative',
  },
  compactImage: {
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    padding: 4,
  },
  info: {
    padding: spacing.sm,
  },
  title: {
    ...typography.caption,
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
