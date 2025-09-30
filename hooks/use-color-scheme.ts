import { useThemePreference } from '@/context/theme-preference';

export function useColorScheme() {
  const { scheme } = useThemePreference();
  return scheme;
}
