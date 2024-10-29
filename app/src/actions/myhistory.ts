import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '@utils/logger';
import { POI } from './poi';

export const getAllHistoryPlaces = async () => {
  try {
    const result = await AsyncStorage.getItem('@myhistory');
    return JSON.parse(result || '[]') as POI[];
  } catch (e) {
    logger.error(e, 'getAllHistoryPlaces');
  }

  return [];
};

export const setHistoryPlaceStorage = async (history: POI) => {
  try {
    const currentHistory = await getAllHistoryPlaces();
    const historyList = [history, ...currentHistory];

    const noDuplicates = new Set();

    const filteredHistoryList = historyList.filter(i => {
      const isDuplicate: boolean = noDuplicates.has(i.name);

      noDuplicates.add(i.name);

      return !isDuplicate;
    });

    //Limit history list  and remove older entries
    if (filteredHistoryList.length > 7) {
      filteredHistoryList.pop();
    }

    await AsyncStorage.setItem(
      '@myhistory',
      JSON.stringify(filteredHistoryList),
    );
  } catch (e) {
    logger.error(e, 'setHistoryPlaceStorage');
  }
};
