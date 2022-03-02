import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from 'react-native-geolocation-service';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    flex: 0,
  },
});

export default () => {
  const [userLocationEnabled, setUserLocationEnabled] =
    useState<boolean>(false);

  const checkAndroidPermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      Geolocation.getCurrentPosition(
        () => setUserLocationEnabled(true),
        error => console.info('currentPosition', error, Platform.OS),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          showLocationDialog: true,
          forceRequestLocation: true,
        },
      );
    } catch (e) {
      console.info('checkAndroidPermission error:', { e });
    }
  }, []);

  const checkIOSPermission = useCallback(async () => {
    try {
      const result = await Geolocation.requestAuthorization('always');

      setUserLocationEnabled(result === 'granted');
    } catch (e) {
      console.info('checkIOSPermission error:', { e });
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      checkAndroidPermission();
    } else {
      checkIOSPermission();
    }
  }, [checkAndroidPermission, checkIOSPermission]);

  return Platform.OS === 'ios' ? (
    <Portal>
      <Modal style={styles.modal} visible={!userLocationEnabled}>
        <Text>
          Pour obtenir une meilleure expérience, activez la position de
          l'appareil et autorisez l'accès à votre position.
        </Text>
        <Button
          onPress={() => {
            Linking.openSettings();
          }}>
          Ouvrir les réglages
        </Button>
      </Modal>
    </Portal>
  ) : null;
};
