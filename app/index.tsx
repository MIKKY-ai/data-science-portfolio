// Splash / Onboarding Screen
// First screen users see - shows BlockCart branding and onboarding slides
// Checks AsyncStorage to determine if user has completed onboarding

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../src/store';
import { colors, spacing, typography, borderRadius } from '../src/utils/theme';
import { STORAGE_KEYS } from '../src/utils/constants';

const { width } = Dimensions.get('window');

// Onboarding slide data
const slides = [
  {
    id: '1',
    icon: 'shield-checkmark' as const,
    title: 'Verified Luxury',
    description: 'Every Prada, Louis Vuitton, Gucci and more — verified on the blockchain to guarantee authenticity.',
  },
  {
    id: '2',
    icon: 'qr-code' as const,
    title: 'QR Verification',
    description: 'Scan QR codes to instantly verify product authenticity on the Polygon network.',
  },
  {
    id: '3',
    icon: 'diamond' as const,
    title: 'Shop with Confidence',
    description: 'Premium bags, shoes, watches and clothing from the world\'s finest luxury houses.',
  },
];

export default function SplashScreen() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Animate splash logo
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    // Check if user has completed onboarding
    const checkOnboarding = async () => {
      const hasOnboarded = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED);
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)/home');
        } else if (hasOnboarded) {
          router.replace('/(auth)/login');
        } else {
          setShowOnboarding(true);
        }
      }, 2000);
    };
    checkOnboarding();
  }, [isAuthenticated]);

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  if (showOnboarding) {
    return (
      <View style={styles.container}>
        <FlatList
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentSlide(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={80} color={colors.primary} />
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideDescription}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentSlide === index && styles.activeDot]}
            />
          ))}
        </View>
        <View style={styles.bottomButtons}>
          {currentSlide < slides.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleGetStarted}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[styles.nextButton, { flex: 1 }]} onPress={handleGetStarted}>
              <Text style={styles.nextText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Splash screen with animated logo
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoIcon}>
          <Ionicons name="cube" size={48} color={colors.primary} />
        </View>
        <Text style={styles.logoText}>BlockCart</Text>
        <Text style={styles.tagline}>Blockchain – Trusted Shopping</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(201, 168, 76, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  tagline: {
    ...typography.body,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  slideTitle: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 24,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  skipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  nextText: {
    ...typography.button,
    color: '#000',
  },
});
