// Auth Layout - Stack navigator for login and registration screens

import { Stack } from 'expo-router';
import { colors } from '../../src/utils/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
