import AsyncStorage from '@react-native-async-storage/async-storage';
import { POI } from './poi';

export const getAllPlaces = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const matches = keys.find(s => s.includes('@myplaces'));
    const result = await AsyncStorage.getItem(matches!);
    return result
  } catch (e) {
    console.error(e);
  }
};

// export const getPlaceById = async (key: string) => {
//   try {
//     const jsonValue = await AsyncStorage.getItem(key);
//     return jsonValue != null ? JSON.parse(jsonValue) : null;
//   } catch (e) {
//     console.error(e);
//   }
// };

export const setPlaceStorage = async (place: POI) => {
  console.log('setPlaceStorage');

  try {
    //recupérer les autres et je concat
    const currentPlaces = await getAllPlaces();
    const jsonValue = JSON.stringify(place);
    const r = JSON.stringify(currentPlaces);

    if (currentPlaces && currentPlaces.length) {
      await AsyncStorage.mergeItem?.(`@myplaces`, r.concat(jsonValue));
    } else {
      await AsyncStorage.setItem(`@myplaces`, jsonValue);
    }
  } catch (e) {
    console.error(e);
  }
};

export const updatePlaceStorage = async (key: string | number, place: POI) => {
  try {
    const jsonValue = JSON.stringify(place);
    await AsyncStorage.mergeItem?.(`@myplaces`, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const removePlaceStorage = async (key: string | number) => {
  console.log('removePlaceStorage', key);

  try {
    await AsyncStorage.removeItem(`@myplaces`);
  } catch (e) {
    console.error(e);
  }
};
