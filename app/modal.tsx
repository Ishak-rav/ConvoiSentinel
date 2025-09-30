import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemePreference, type ThemePreference } from '@/context/theme-preference';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ModalScreen() {
  const { preference, setPreference, scheme, ready } = useThemePreference();
  const tint = useThemeColor({}, 'tint');

  const Option = ({ value, label }: { value: ThemePreference; label: string }) => {
    const active = preference === value;
    return (
      <Pressable
        onPress={() => setPreference(value)}
        style={[
          styles.option,
          active ? { borderColor: tint, backgroundColor: 'rgba(11,61,145,0.08)' } : null,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
      >
        <View style={[styles.radio, active ? { borderColor: tint, backgroundColor: tint } : null]} />
        <ThemedText style={styles.optionLabel}>{label}</ThemedText>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Apparence</ThemedText>
      {!ready ? (
        <ThemedText>Chargement…</ThemedText>
      ) : (
        <>
          <Option value="light" label="Jour (clair)" />
          <Option value="dark" label="Nuit (sombre)" />
          <Option value="system" label="Système (suivre l’appareil)" />
          <ThemedText style={styles.helper}>
            Thème actuel: {scheme === 'dark' ? 'Nuit' : 'Jour'}
          </ThemedText>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'flex-start',
  },
  title: {
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    backgroundColor: 'transparent',
  },
  optionLabel: {
    fontSize: 16,
  },
  helper: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
});
