import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemePreferenceState = {
  preference: ThemePreference;
  scheme: 'light' | 'dark';
  setPreference: (pref: ThemePreference) => void;
  ready: boolean;
};

const STORAGE_KEY = '@convoisentinel:theme';

const ThemePreferenceContext = createContext<ThemePreferenceState | undefined>(undefined);

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme() ?? 'light';
  const [preference, setPref] = useState<ThemePreference>('system');
  const [ready, setReady] = useState(false);

  // Charger la préférence depuis le storage
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (raw === 'light' || raw === 'dark' || raw === 'system') {
          setPref(raw);
        } else {
          setPref('system');
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Persister la préférence
  const setPreference = useCallback((pref: ThemePreference) => {
    setPref(pref);
    AsyncStorage.setItem(STORAGE_KEY, pref).catch(() => {});
  }, []);

  // Résoudre le scheme effectif
  const scheme = useMemo<'light' | 'dark'>(() => {
    if (preference === 'system') return systemScheme;
    return preference;
  }, [preference, systemScheme]);

  const value = useMemo(
    () => ({ preference, setPreference, scheme, ready }),
    [preference, setPreference, scheme, ready]
  );

  // Écouter les changements système en cas de 'system' (Android/iOS)
  useEffect(() => {
    if (preference !== 'system') return;
    const sub = Appearance.addChangeListener(() => {
      // Force update en changeant légèrement l'état (scheme est dérivé de useRNColorScheme)
      // Ici rien à faire spécifiquement car useRNColorScheme réagit déjà.
    });
    return () => {
      // @ts-ignore newer RN returns object with remove(), older returns unsubscribe fn
      sub?.remove?.();
    };
  }, [preference]);

  return (
    <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceState {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within ThemePreferenceProvider');
  }
  return ctx;
}