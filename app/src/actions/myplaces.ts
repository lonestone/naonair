import AsyncStorage from '@react-native-async-storage/async-storage';
import { POI } from './poi';

export const getAllPlaces = async () => {
  try {
    const result = await AsyncStorage.getItem('@myplaces');
    return JSON.parse(result || '[]') as POI[];
  } catch (e) {
    console.error(e);
  }

  return [];
};

export const getOne = async (id: string | number) => {
  try {
    const currentPlaces = await getAllPlaces();
    const newIndex = currentPlaces.findIndex((place: POI) => place.id === id);

    if (newIndex <= -1) {
      return null;
    }
    return { currentPlaces, newIndex };
  } catch (e) {
    console.error(e);
  }
};

export const setPlaceStorage = async (place: POI) => {
  try {
    const currentPlaces = await getAllPlaces();
    const jsonValue = JSON.stringify([...currentPlaces, place]);
    await AsyncStorage.setItem('@myplaces', jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const updatePlaceStorage = async (id: string | number, place: POI) => {
  try {
    const result = await getOne(id);
    if (result) {
      result.currentPlaces[result.newIndex] = place;
      await AsyncStorage.setItem(
        '@myplaces',
        JSON.stringify(result.currentPlaces),
      );
    }
  } catch (e) {
    console.error(e);
  }
};

export const removePlaceStorage = async (id?: string | number) => {
  try {
    const result = await getOne(id!);
    if (result) {
      result.currentPlaces.splice(result.newIndex, 1);
      await AsyncStorage.setItem(
        '@myplaces',
        JSON.stringify(result.currentPlaces),
      );
    }
  } catch (e) {
    console.error(e);
  }
};

export const clearStorage = async () => {
  //TODO : Clear all or clear only @myplaces
  await AsyncStorage.clear();
};
