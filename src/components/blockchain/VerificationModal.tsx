// Verification Modal - Displays blockchain verification results
// Shows animated verification status with product authentication details

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../../utils/theme';

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  isVerifying: boolean;
  isVerified: boolean | null;
  productName?: string;
  hash?: string;
}

export default function VerificationModal({
  visible,
  onClose,
  isVerifying,
  isVerified,
  productName,
  hash,
}: VerificationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          {isVerifying ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.title}>Verifying on Blockchain...</Text>
              <Text style={styles.subtitle}>Checking Polygon network</Text>
            </View>
          ) : isVerified ? (
            <View style={styles.center}>
              <View style={styles.successIcon}>
                <Ionicons name="shield-checkmark" size={48} color={colors.success} />
              </View>
              <Text style={[styles.title, { color: colors.success }]}>Authentic Product</Text>
              <Text style={styles.subtitle}>{productName}</Text>
              <View style={styles.hashContainer}>
                <Text style={styles.hashLabel}>Blockchain Hash</Text>
                <Text style={styles.hashValue} numberOfLines={1}>
                  {hash?.substring(0, 20)}...{hash?.substring(hash.length - 8)}
                </Text>
              </View>
              <View style={styles.networkBadge}>
                <Ionicons name="link" size={14} color={colors.primary} />
                <Text style={styles.networkText}>Verified on Polygon Network</Text>
              </View>
            </View>
          ) : (
            <View style={styles.center}>
              <View style={styles.warningIcon}>
                <Ionicons name="warning" size={48} color={colors.warning} />
              </View>
              <Text style={[styles.title, { color: colors.warning }]}>Unverified Product</Text>
              <Text style={styles.subtitle}>
                This product could not be verified on the blockchain. It may be counterfeit.
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  center: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 167, 38, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  hashContainer: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    width: '100%',
    marginBottom: spacing.md,
  },
  hashLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  hashValue: {
    ...typography.bodySmall,
    color: colors.primary,
    fontFamily: 'monospace',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  networkText: {
    ...typography.caption,
    color: colors.primary,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  closeText: {
    ...typography.button,
    color: '#000',
  },
});
