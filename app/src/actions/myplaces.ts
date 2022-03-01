import AsyncStorage from '@react-native-async-storage/async-storage';
import { POI } from './poi';

export const getAllPlaces = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys as string[]);
    //TODO check myplace_ prefix to render wanted item
    return result!.map(tab => JSON.parse(tab[1]!));
  } catch (e) {
    console.error(e);
  }
};

export const getPlaceById = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

export const setPlaceStorage = async (place: POI) => {
  try {
    const jsonValue = JSON.stringify(place);
    await AsyncStorage.setItem(`myplace_${place?.id}`, jsonValue);
  } catch (e) {
    console.error(e)
  }
};

export const updatePlaceStorage = async (key: string | number, place: POI) => {
  try {
    const jsonValue = JSON.stringify(place);
    await AsyncStorage.mergeItem?.(`${key}`, jsonValue);
  } catch (e) {
    console.error(e)
  }
}