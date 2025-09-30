import { useThemePreference } from '@/context/theme-preference';

/**
 * Web: unifie l'origine du scheme (light/dark) avec la préférence utilisateur
 * (light | dark | system) via le contexte ThemePreference.
 */
export function useColorScheme() {
  const { scheme } = useThemePreference();
  return scheme;
}
