import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const checkAndroidPermission = async (): Promise<boolean> => {
  try {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    ]);
  } catch (e) {
    console.info(e);
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      () => {
        resolve(true);
      },
      error => {
        console.info('currentPosition', error, Platform.OS);
        reject(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        showLocationDialog: true,
        forceRequestLocation: true,
      },
    );
  });
};

export const checkIOSPermission = async () => {
  const result = await Geolocation.requestAuthorization('always');
  return result === 'granted';
};
