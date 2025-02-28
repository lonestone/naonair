import { Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const configureGeolocationLibrary = (background: boolean = false) => {
  let actualBackground: boolean = true;
  if (Platform.OS === 'android') {
    actualBackground = background;
    if (background) {
      console.log('Starting background service with notification');
    } else {
      console.log('Ending background service');
    }
  }
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'always',
    locationProvider: 'auto',
    enableBackgroundLocationUpdates: actualBackground,
  });
};

export const checkAndroidPermission = async (): Promise<boolean> => {
  try {
    const permissions = {
      fine: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      coarse: PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      background: PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    };

    let grantedFine = await PermissionsAndroid.check(permissions.fine);
    let grantedCoarse = await PermissionsAndroid.check(permissions.coarse);
    let grantedBackground = await PermissionsAndroid.check(permissions.background);

    if (!grantedFine && !grantedCoarse) {
      const resultFine = await PermissionsAndroid.request(permissions.fine);
      const resultCoarse = await PermissionsAndroid.request(permissions.coarse);

      grantedFine = resultFine === PermissionsAndroid.RESULTS.GRANTED;
      grantedCoarse = resultCoarse === PermissionsAndroid.RESULTS.GRANTED;

      if (!grantedFine && !grantedCoarse) {
        console.warn('Coarsed/Fine not granted');
        return false;
      }
    }

    if (!grantedBackground) {
      const resultBackground = await PermissionsAndroid.request(permissions.background);
      if (resultBackground !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Background not granted');
        Linking.openSettings();
      }
    }

    /*
    if (!grantedBackground) {
      Alert.alert(
        'Permission requise',
        "L'accès en arrière-plan est nécessaire pour cette fonctionnalité.",
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Ouvrir les paramètres', onPress: Linking.openSettings },
        ]
      );
    }
      */
  } catch (e) {
    console.error('Permissions error', e);
  }

  return true;
};

export const checkIOSPermission = async () => {
  const result = await Geolocation.requestAuthorization('always');
  return result === 'granted';
};

export const checkPermission = async () => {
  if (Platform.OS === 'android') {
    return checkAndroidPermission();
  }
  if (Platform.OS === 'ios') {
    return checkIOSPermission();
  }
};

export const checkAndroidPermissionAndGetLocation = async (): Promise<boolean> => {
  await checkAndroidPermission();

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