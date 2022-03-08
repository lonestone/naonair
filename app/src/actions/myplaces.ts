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
    const currentPlaces = await getAllPlaces();
    const newIndex = currentPlaces.findIndex((place: POI) => place.id === id);

    if (newIndex <= -1) {
      return;
    }

    currentPlaces[newIndex] = place;
    await AsyncStorage.setItem('@myplaces', JSON.stringify(currentPlaces));
  } catch (e) {
    console.error(e);
  }
};

export const removePlaceStorage = async (id?: string | number) => {
  try {
    const currentPlaces = await getAllPlaces();
    const newIndex = currentPlaces.findIndex((place: POI) => {
      return place.id === id;
    });

    if (newIndex <= -1) {
      return;
    }

    currentPlaces.splice(newIndex, 1);
    await AsyncStorage.setItem('@myplaces', JSON.stringify(currentPlaces));
  } catch (e) {
    console.error(e);
  }
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
};
