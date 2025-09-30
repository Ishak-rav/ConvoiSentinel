import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemePreferenceProvider } from '@/context/theme-preference';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <NavigationThemeLayout />
    </ThemePreferenceProvider>
  );
}

function NavigationThemeLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Thème' }} />
        <Stack.Screen name="add-obstacle" options={{ title: 'Ajouter un obstacle' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
