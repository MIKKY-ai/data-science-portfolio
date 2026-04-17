// Category Listing Screen - Displays products filtered by category
// Supports sorting by price and shows products in a 2-column grid

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../../../src/store';
import ProductCard from '../../../../src/components/product/ProductCard';
import { CATEGORIES } from '../../../../src/utils/constants';
import { colors, spacing, typography, borderRadius } from '../../../../src/utils/theme';

type SortOption = 'default' | 'price-low' | 'price-high' | 'rating';

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const products = useAppSelector((state) => state.products.items);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Find the category config to get the API category name
  const category = CATEGORIES.find((c) => c.id === name);
  const categoryTitle = category?.name || (name === 'all' ? 'All Products' : name);

  // Filter products by category, or show all
  const filteredProducts = useMemo(() => {
    let filtered = name === 'all'
      ? products
      : products.filter((p) => p.category === name);

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating.rate - a.rating.rate);
      default:
        return filtered;
    }
  }, [products, name, sortBy, category]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryTitle}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Sort options */}
      <View style={styles.sortBar}>
        <Text style={styles.resultCount}>{filteredProducts.length} products</Text>
        <View style={styles.sortOptions}>
          {(['default', 'price-low', 'price-high', 'rating'] as SortOption[]).map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.sortChip, sortBy === option && styles.sortChipActive]}
              onPress={() => setSortBy(option)}
            >
              <Text style={[styles.sortChipText, sortBy === option && styles.sortChipTextActive]}>
                {option === 'default' ? 'All' : option === 'price-low' ? '£↑' : option === 'price-high' ? '£↓' : '★'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Product grid */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/(tabs)/home/${item.id}`)}
            compact
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found in this category</Text>
        }
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
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  resultCount: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  sortChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  sortChipActive: {
    backgroundColor: colors.primary,
  },
  sortChipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sortChipTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
