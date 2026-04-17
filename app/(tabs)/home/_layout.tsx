// Home Stack Layout - Nested stack navigation for Home, Product Detail, and Category screens

import { Stack } from 'expo-router';
import { colors } from '../../../src/utils/theme';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
