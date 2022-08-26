import AsyncStorage from '@react-native-async-storage/async-storage';
import { ARParcours } from './parcours';
import { POI } from './poi';

const FAVORITES_KEY = '@favorites';

export const getFavorites = async function (): Promise<Set<string>> {
  const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!favorites) {
    return new Set([]);
  }
  return new Set(favorites.split('|'));
};

export const isFavorited = async function (item: POI | ARParcours) {
  const favorites = await getFavorites();
  const id = 'id' in item ? `${item.id}` : `${item.properties.id}`;
  return favorites.has(id);
};

const setFavorites = async function (favorites: string[]) {
  const formatedFavorites = favorites.join('|');
  await AsyncStorage.setItem(FAVORITES_KEY, formatedFavorites);
};

export const addToFavorites = async function (item: POI | ARParcours) {
  const current = await getFavorites();
  const idToAdd = 'id' in item ? `${item.id}` : `${item.properties.id}`;
  if (!current.has(idToAdd)) {
    const favoritesArray = Array.from(current);
    await setFavorites([...favoritesArray, idToAdd]);
  }
};

export const removeFromFavorites = async function (item: POI | ARParcours) {
  const current = await getFavorites();
  const idToRemove = 'id' in item ? item.id : item.properties.id;
  const favoritesArray = Array.from(current);
  await setFavorites(favoritesArray.filter(id => id !== `${idToRemove}`));
};
