// BlockCart Theme Configuration
// Dark luxury theme with gold accents for premium e-commerce feel

export const colors = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  primary: '#C9A84C',
  primaryLight: '#E5D5A0',
  primaryDark: '#A08930',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',
  error: '#FF4444',
  success: '#4CAF50',
  warning: '#FFA726',
  border: '#333333',
  card: '#1E1E1E',
  tabBar: '#111111',
  inputBackground: '#1E1E1E',
  overlay: 'rgba(0,0,0,0.7)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '600' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
};
