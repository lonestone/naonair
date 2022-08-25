import AsyncStorage from '@react-native-async-storage/async-storage';
import { ARParcours } from './parcours';
import { POI } from './poi';

const FAVORITES_KEY = '@favorites';

export const getFavorites = async (): Promise<string[]> => {
  const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!favorites) {
    return [];
  }
  return favorites.split('|');
};

const setFavorites = async (favorites: string[]) => {
  const formatedFavorites = favorites.join('|');
  await AsyncStorage.setItem(FAVORITES_KEY, formatedFavorites);
};

export const addToFavorites = async (item: POI | ARParcours) => {
  const current = await getFavorites();
  const idToAdd = 'id' in item ? item.id : item.properties.id;
  await setFavorites([...current, `${idToAdd}`]);
};

export const removeFromFavorites = async (item: POI | ARParcours) => {
  const current = await getFavorites();
  const idToRemove = 'id' in item ? item.id : item.properties.id;
  await setFavorites([...current].filter(id => id !== `${idToRemove}`));
};
