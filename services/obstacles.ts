import AsyncStorage from '@react-native-async-storage/async-storage';

export type Obstacle = {
  id: string;
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  photoUri?: string;
  createdAt: number;
};

const STORAGE_KEY = '@convoisentinel:obstacles';

/**
 * Charger tous les obstacles depuis le stockage local
 */
async function getAll(): Promise<Obstacle[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: unknown = JSON.parse(raw);
    return Array.isArray(list) ? (list as Obstacle[]) : [];
  } catch (e) {
    console.warn('Failed to read obstacles', e);
    return [];
  }
}

/**
 * Écraser la liste complète des obstacles
 */
async function saveAll(list: Obstacle[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save obstacles', e);
    throw e;
  }
}

/**
 * Ajouter un obstacle
 */
async function add(
  partial: Omit<Obstacle, 'id' | 'createdAt'> & { id?: string; createdAt?: number }
): Promise<Obstacle> {
  const list = await getAll();
  const now = Date.now();
  const newItem: Obstacle = {
    id: partial.id ?? `${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: partial.createdAt ?? now,
    title: (partial.title ?? 'Obstacle').trim(),
    description: (partial.description ?? '').trim(),
    latitude:
      typeof partial.latitude === 'number' && !Number.isNaN(partial.latitude)
        ? partial.latitude
        : undefined,
    longitude:
      typeof partial.longitude === 'number' && !Number.isNaN(partial.longitude)
        ? partial.longitude
        : undefined,
    photoUri: partial.photoUri,
  };

  // Ajouter en tête de liste (le plus récent en premier)
  list.unshift(newItem);
  await saveAll(list);
  return newItem;
}

/**
 * Supprimer un obstacle par id
 */
async function remove(id: string): Promise<void> {
  const list = await getAll();
  const next = list.filter((o) => o.id !== id);
  await saveAll(next);
}

/**
 * Vider tous les obstacles (utile pour debug)
 */
async function clear(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export const ObstaclesStore = {
  STORAGE_KEY,
  getAll,
  saveAll,
  add,
  remove,
  clear,
};