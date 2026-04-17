// Home Screen - Main product browsing screen for luxury products
// Features: hero banner, category grid (Bags, Shoes, Watches, Clothing),
// featured products carousel, new arrivals grid
// Fetches product data via Redux thunk with REST API demonstration

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../src/store';
import { fetchProducts } from '../../../src/store/slices/productsSlice';
import { registerDemoProducts } from '../../../src/services/api/blockchainApi';
import ProductCard from '../../../src/components/product/ProductCard';
import { CATEGORIES } from '../../../src/utils/constants';
import { colors, spacing, typography, borderRadius } from '../../../src/utils/theme';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: products, isLoading } = useAppSelector((state) => state.products);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchProducts()).then((result) => {
      // Register all product hashes as "verified" for the demo
      if (fetchProducts.fulfilled.match(result)) {
        const hashes = result.payload.map((p) => p.blockchainHash).filter(Boolean) as string[];
        registerDemoProducts(hashes);
      }
    });
  }, [dispatch]);

  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(8, 20);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchProducts())}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Shopper'}</Text>
          </View>
          <View style={styles.logoContainer}>
            <Ionicons name="cube" size={20} color={colors.primary} />
            <Text style={styles.logoText}>BlockCart</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <TouchableOpacity style={styles.heroBanner} activeOpacity={0.9}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
              <Text style={styles.heroBadgeText}>Blockchain Verified</Text>
            </View>
            <Text style={styles.heroTitle}>Luxury{'\n'}Authenticated</Text>
            <Text style={styles.heroSubtitle}>
              Every product verified on the Polygon blockchain.{'\n'}Shop Prada, Louis Vuitton, Gucci & more.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push(`/(tabs)/home/category/${category.id}`)}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon as any} size={28} color={colors.primary} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Collection</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/home/category/all')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {isLoading && products.length === 0 ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ padding: spacing.xl }} />
          ) : (
            <FlatList
              data={featuredProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: spacing.md }}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => router.push(`/(tabs)/home/${item.id}`)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>

        {/* New Arrivals */}
        <View style={[styles.section, { marginBottom: spacing.xxl }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
          </View>
          <View style={styles.productGrid}>
            {newArrivals.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onPress={() => router.push(`/(tabs)/home/${item.id}`)}
                compact
              />
            ))}
          </View>
        </View>
      </ScrollView>
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
  greeting: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h2,
    color: colors.text,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroBanner: {
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.2)',
  },
  heroContent: {
    padding: spacing.xl,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    gap: 4,
    marginBottom: spacing.md,
  },
  heroBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 38,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  seeAll: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryCard: {
    width: '23%' as any,
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryName: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
});
