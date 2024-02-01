import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

export const getIsFirstLaunched = async () => {
  try {
    const result = await AsyncStorage.getItem('@firstLaunched');
    if (result) {
      return JSON.parse(result);
    } else {
      return null;
    }
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

export const getIsFirstNotificationLaunched = async (
  callback: () => Promise<boolean>,
) => {
  try {
    const firstLaunch = await AsyncStorage.getItem(
      '@firstNotificationLaunched',
    );
    if (firstLaunch) {
      return JSON.parse(firstLaunch);
    } else {
      await callback().then(result => {
        if (result) {
          setIsFirstNotificationLaunched('false');
        }
      });
      return null;
    }
  } catch (e) {
    logger.error(e, 'getIsFirstNotificationLaunched');
  }
};

export const setIsFirstNotificationLaunched = async (
  firstNotificationLaunched: string,
) => {
  try {
    await AsyncStorage.setItem(
      '@firstNotificationLaunched',
      firstNotificationLaunched,
    );
  } catch (e) {
    logger.error(e, 'setIsFirstNotificationLaunched');
  }
};

export const getCGUAccepted = async () => {
  try {
    const result = await AsyncStorage.getItem('@cgu');
    if (result) {
      return JSON.parse(result);
    } else {
      return null;
    }
  } catch (e) {
    logger.error(e, 'getCGUAccepted');
  }
};

export const setCGUAccepted = async (version: string) => {
  try {
    await AsyncStorage.setItem('@cgu', version);
  } catch (e) {
    logger.error(e, 'setCGUAccepted');
  }
};
