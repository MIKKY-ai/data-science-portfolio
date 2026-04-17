// QR Scanner Screen - Scans product QR codes for blockchain verification
// Uses expo-camera barcode scanning to read product verification data
// Demonstrates additional framework feature (camera API)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { verifyProduct } from '../../src/store/slices/verificationSlice';
import VerificationModal from '../../src/components/blockchain/VerificationModal';
import Button from '../../src/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '../../src/utils/theme';

export default function ScannerScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isVerifying, results } = useAppSelector((state) => state.verification);
  const products = useAppSelector((state) => state.products.items);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<{
    name: string;
    hash: string;
    verified: boolean | null;
  } | null>(null);

  // Handle barcode scan result
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      // Try to parse QR data as JSON (format: {"productId": 1, "hash": "0x..."})
      const qrData = JSON.parse(data);
      if (qrData.productId && qrData.hash) {
        const product = products.find((p) => p.id === qrData.productId);
        setScannedProduct({
          name: product?.title || `Product #${qrData.productId}`,
          hash: qrData.hash,
          verified: null,
        });
        setShowVerification(true);
        dispatch(verifyProduct({ productId: qrData.productId, hash: qrData.hash }));
        return;
      }
    } catch {
      // If not JSON, try to match hash directly with a product
    }

    // Fallback: try to match the scanned data as a product hash
    const matchedProduct = products.find((p) => p.blockchainHash === data);
    if (matchedProduct) {
      setScannedProduct({
        name: matchedProduct.title,
        hash: data,
        verified: null,
      });
      setShowVerification(true);
      dispatch(verifyProduct({ productId: matchedProduct.id, hash: data }));
    } else {
      // Demo mode: verify any product for demonstration purposes
      const demoProduct = products[0];
      if (demoProduct?.blockchainHash) {
        setScannedProduct({
          name: demoProduct.title,
          hash: demoProduct.blockchainHash,
          verified: null,
        });
        setShowVerification(true);
        dispatch(
          verifyProduct({ productId: demoProduct.id, hash: demoProduct.blockchainHash })
        );
      } else {
        Alert.alert('Scan Result', `Scanned: ${data}\n\nNo matching product found.`);
      }
    }
  };

  const handleCloseVerification = () => {
    setShowVerification(false);
    setScanned(false);
    setScannedProduct(null);
  };

  // Camera permission handling
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera-outline" size={64} color={colors.textMuted} />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            BlockCart needs camera access to scan QR codes for product verification.
          </Text>
          <Button title="Grant Permission" onPress={requestPermission} style={{ marginTop: spacing.lg }} />
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={{ marginTop: spacing.md }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const verificationResult = scannedProduct?.hash ? results[scannedProduct.hash] : null;

  return (
    <View style={styles.container}>
      {/* Camera view with barcode scanning */}
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {/* Home button */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.replace('/(tabs)/home')}>
            <Ionicons name="home-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Scan frame overlay */}
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.scanText}>
            Point camera at a product QR code
          </Text>
          <Text style={styles.scanSubtext}>
            Verifying authenticity on Polygon blockchain
          </Text>
        </View>

        {/* Rescan button */}
        {scanned && !showVerification && (
          <View style={styles.rescanContainer}>
            <Button title="Scan Again" onPress={() => setScanned(false)} variant="outline" />
          </View>
        )}
      </CameraView>

      {/* Verification result modal */}
      <VerificationModal
        visible={showVerification}
        onClose={handleCloseVerification}
        isVerifying={isVerifying}
        isVerified={verificationResult?.isVerified ?? null}
        productName={scannedProduct?.name}
        hash={scannedProduct?.hash}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  scanText: {
    ...typography.body,
    color: '#fff',
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  scanSubtext: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  rescanContainer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  permissionIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  permissionText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cancelText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
