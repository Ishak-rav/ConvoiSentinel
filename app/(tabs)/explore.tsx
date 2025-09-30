import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Alert, FlatList, Linking, Pressable, StyleSheet, View } from 'react-native';

type Contact = {
  id: string;
  name: string;
  role?: string;
  phone?: string;
  note?: string;
};

const CONTACTS: Contact[] = [
  { id: '1', name: 'PC Convoi', role: "Permanence", phone: '+33123456789', note: 'Contact principal' },
  { id: '2', name: 'Chef d’escorte', role: 'Jean Dupont', phone: '+33601020304' },
  { id: '3', name: 'Gendarmerie locale', phone: '17', note: 'Urgence' },
  { id: '4', name: 'Service voirie', phone: '+33555112233' },
  { id: '5', name: 'SNCF Passage à niveau', phone: '0800123123' },
];

export default function ContactsScreen() {
  const callNumber = (phone?: string) => {
    if (!phone) {
      Alert.alert('Numéro manquant', 'Aucun numéro de téléphone disponible pour ce contact.');
      return;
    }
    const url = `tel:${phone}`;
    Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <ThemedView style={styles.card}>
      <View style={{ flex: 1 }}>
        <ThemedText type="subtitle">{item.name}</ThemedText>
        {item.role ? <ThemedText style={styles.role}>{item.role}</ThemedText> : null}
        {item.note ? <ThemedText style={styles.note}>{item.note}</ThemedText> : null}
        {item.phone ? (
          <ThemedText style={styles.phone}>{item.phone}</ThemedText>
        ) : (
          <ThemedText style={styles.noPhone}>Aucun numéro</ThemedText>
        )}
      </View>
      <Pressable
        style={[styles.actionBtn, !item.phone ? styles.actionDisabled : styles.actionPrimary]}
        onPress={() => callNumber(item.phone)}
        disabled={!item.phone}
      >
        <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>Appeler</ThemedText>
      </Pressable>
    </ThemedView>
  );

  return (
    <ThemedView style={{ marginTop: 40, flex: 1 }}>
      <FlatList
        data={CONTACTS}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 24 }}>Aucun contact disponible.</ThemedText>
        }
      />
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
    alignItems: 'center',
    gap: 12,
  },
  role: {
    marginTop: 2,
    color: '#555',
  },
  note: {
    marginTop: 2,
    color: '#777',
    fontSize: 12,
  },
  phone: {
    marginTop: 6,
    fontSize: 12,
    color: '#444',
  },
  noPhone: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  actionPrimary: {
    backgroundColor: '#28a745',
  },
  actionDisabled: {
    backgroundColor: '#c2c2c2',
  },
});
