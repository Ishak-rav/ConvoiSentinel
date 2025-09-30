import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ObstaclesStore } from '@/services/obstacles';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function AddObstacleScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  // Couleurs thème (texte, placeholder, accent bleu marine)
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');

  const getGPS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'La permission de localisation est nécessaire.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLatitude(String(pos.coords.latitude));
      setLongitude(String(pos.coords.longitude));
    } catch (e) {
      console.warn(e);
      Alert.alert('Erreur', 'Impossible de récupérer la position GPS.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'La permission caméra est nécessaire.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.6,
        allowsEditing: false,
        exif: false,
      });
      if (!result.canceled && result.assets?.length) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert('Erreur', 'Impossible d’ouvrir la caméra.');
    }
  };

  const onSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const latNum = latitude.trim() ? Number.parseFloat(latitude.trim().replace(',', '.')) : undefined;
      const lonNum = longitude.trim() ? Number.parseFloat(longitude.trim().replace(',', '.')) : undefined;

      if (latNum !== undefined && (Number.isNaN(latNum) || latNum < -90 || latNum > 90)) {
        Alert.alert('Latitude invalide', 'Entrez une latitude entre -90 et 90.');
        return;
      }
      if (lonNum !== undefined && (Number.isNaN(lonNum) || lonNum < -180 || lonNum > 180)) {
        Alert.alert('Longitude invalide', 'Entrez une longitude entre -180 et 180.');
        return;
      }

      await ObstaclesStore.add({
        title: title.trim() || 'Obstacle',
        description: description.trim(),
        latitude: latNum,
        longitude: lonNum,
        photoUri,
      });

      router.back();
    } catch (e) {
      console.warn(e);
      Alert.alert('Erreur', "L'obstacle n'a pas pu être enregistré.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>Ajouter un obstacle</ThemedText>

        <ThemedText type="defaultSemiBold">Titre</ThemedText>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Feu tricolore à démonter"
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={placeholderColor}
        />

        <ThemedText type="defaultSemiBold" style={{ marginTop: 12 }}>Description</ThemedText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Détails utiles..."
          style={[styles.input, styles.multiline, { color: textColor }]}
          placeholderTextColor={placeholderColor}
          multiline
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <ThemedText type="defaultSemiBold">Latitude</ThemedText>
            <TextInput
              value={latitude}
              onChangeText={setLatitude}
              placeholder="48.8566"
              keyboardType="decimal-pad"
              style={[styles.input, { color: textColor }]}
              placeholderTextColor={placeholderColor}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <ThemedText type="defaultSemiBold">Longitude</ThemedText>
            <TextInput
              value={longitude}
              onChangeText={setLongitude}
              placeholder="2.3522"
              keyboardType="decimal-pad"
              style={[styles.input, { color: textColor }]}
              placeholderTextColor={placeholderColor}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.alternate]} onPress={getGPS}>
            <ThemedText type="defaultSemiBold">Utiliser ma position</ThemedText>
          </Pressable>
          <Pressable style={[styles.button, styles.alternate]} onPress={takePhoto}>
            <ThemedText type="defaultSemiBold">Prendre une photo</ThemedText>
          </Pressable>
        </View>

        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : null}

        <Pressable style={[styles.button, styles.primary, { backgroundColor: tint }]} onPress={onSave} disabled={saving}>
          <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </ThemedText>
        </Pressable>

        <Pressable style={[styles.button, styles.ghost]} onPress={() => router.back()} disabled={saving}>
          <ThemedText type="defaultSemiBold">Annuler</ThemedText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  title: {
    marginBottom: 4,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primary: {
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: '#E6E6E6',
  },
  alternate: {
    backgroundColor: '#797d7eff',
  },
  ghost: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    alignItems: 'center',
    marginTop: 8,
  },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
});