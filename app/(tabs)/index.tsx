import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Obstacle, ObstaclesStore } from '@/services/obstacles';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Linking, Pressable, StyleSheet, View } from 'react-native';

export default function ObstaclesScreen() {
  const [data, setData] = useState<Obstacle[]>([]);
  const [loading, setLoading] = useState(false);
  const tint = useThemeColor({}, 'tint');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await ObstaclesStore.getAll();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      load();
      return () => {};
    }, [load])
  );

  const confirmDelete = (id: string) => {
    Alert.alert('Supprimer', 'Confirmer la suppression de cet obstacle ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await ObstaclesStore.remove(id);
          load();
        },
      },
    ]);
  };

  const openMap = (o: Obstacle) => {
    if (o.latitude == null || o.longitude == null) {
      Alert.alert('Coordonnées manquantes', "Ajoutez latitude et longitude pour l'afficher sur la carte.");
      return;
    }
    const url = `https://www.google.com/maps?q=${o.latitude},${o.longitude}`;
    Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: Obstacle }) => (
    <ThemedView style={styles.card}>
      <View style={{ flex: 1 }}>
        <ThemedText type="subtitle">{item.title}</ThemedText>
        {item.description ? (
          <ThemedText numberOfLines={2} style={styles.desc}>{item.description}</ThemedText>
        ) : null}
        <ThemedText style={styles.coords}>
          {item.latitude != null && item.longitude != null
            ? `Lat: ${item.latitude.toFixed(6)} | Lon: ${item.longitude.toFixed(6)}`
            : 'Coordonnées non définies'}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.actionBtn, styles.ghost]} onPress={() => openMap(item)}>
          <ThemedText type="defaultSemiBold">Carte</ThemedText>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.danger]} onPress={() => confirmDelete(item.id)}>
          <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>Supprimer</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ marginTop: 40, flex: 1 }}>Dans la fenêtre ajouter un obstacle les boutons "Utiliser ma position" et "Prendre une photo" sont t
        <View style={{ alignItems: 'flex-end', paddingHorizontal: 12, marginBottom: 8 }}>
          <Link href="/modal" asChild>
            <Pressable
              style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: '#999' }}
              accessibilityLabel="Changer d'apparence"
            >
              <ThemedText type="defaultSemiBold">Apparence</ThemedText>
            </Pressable>
          </Link>
        </View>
        <FlatList
          contentContainerStyle={styles.list}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: 'center', marginTop: 24 }}>
              {loading ? 'Chargement...' : 'Aucun obstacle. Ajoutez-en un avec le bouton +'}
            </ThemedText>
          }
        />
      </View>
      <Link href="/add-obstacle" asChild>
        <Pressable style={styles.fab} accessibilityLabel="Ajouter un obstacle">
          <ThemedText type="title" style={{ color: 'white' }}>+</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 12,
    gap: 8,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  desc: {
    marginTop: 4,
  },
  coords: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
  actions: {
    gap: 8,
    alignItems: 'flex-end',
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  danger: {
    backgroundColor: '#d9534f',
  },
  ghost: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    backgroundColor: 'transparent',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
