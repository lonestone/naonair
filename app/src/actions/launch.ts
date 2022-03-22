import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

export const getIsFirstLaunched = async () => {
  try {
    const result = await AsyncStorage.getItem('@firstLaunched');
    if (result) {
      return JSON.parse(result);
    } else return null;
  } catch (e) {
    logger.error(e, 'getIsFirstLaunched');
  }
};

export const setIsFirstLaunched = async (firstLaunch: string) => {
  try {
    await AsyncStorage.setItem('@firstLaunched', firstLaunch);
  } catch (e) {
    logger.error(e, 'setIsFirstLaunched');
  }
};
