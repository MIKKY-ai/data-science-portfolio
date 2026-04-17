// Profile Screen - User account management and app settings
// Demonstrates AsyncStorage for preferences, expo-device for platform info
// Provides navigation to QR scanner and logout functionality

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { logoutUser } from '../../src/store/slices/authSlice';
import { STORAGE_KEYS } from '../../src/utils/constants';
import { colors, spacing, typography, borderRadius } from '../../src/utils/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load preferences from AsyncStorage
  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (prefs) {
        const parsed = JSON.parse(prefs);
        setNotificationsEnabled(parsed.notifications ?? true);
      }
    };
    loadPreferences();
  }, []);

  // Save preference to AsyncStorage when toggled
  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    const prefs = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    const parsed = prefs ? JSON.parse(prefs) : {};
    await AsyncStorage.setItem(
      STORAGE_KEYS.PREFERENCES,
      JSON.stringify({ ...parsed, notifications: value })
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logoutUser());
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  // Menu items for the profile screen
  const menuItems = [
    {
      icon: 'shield-checkmark-outline',
      label: 'Verification History',
      subtitle: 'View past verifications',
      onPress: () => {},
      color: colors.success,
    },
    {
      icon: 'location-outline',
      label: 'Shipping Addresses',
      subtitle: 'Manage your addresses',
      onPress: () => {},
      color: colors.primary,
    },
    {
      icon: 'card-outline',
      label: 'Payment Methods',
      subtitle: 'Manage payment options',
      onPress: () => {},
      color: colors.primary,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User info card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Device info - demonstrates expo-device platform-specific API */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Info</Text>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceText}>
              {Device.modelName || 'Unknown Device'} · {Device.osName} {Device.osVersion}
            </Text>
            <Text style={styles.deviceText}>BlockCart v1.0.0</Text>
          </View>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xxl }} />
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.h3,
    color: colors.text,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
  },
  deviceInfo: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  deviceText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    gap: spacing.sm,
  },
  logoutText: {
    ...typography.body,
    color: colors.error,
    fontWeight: '600',
  },
});
