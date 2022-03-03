import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import {
  checkAndroidPermission,
  checkIOSPermission,
} from '../../actions/location';

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

  const watchId = useRef<number | null>();

  const watch = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        await checkAndroidPermission();
      } else {
        setUserLocationEnabled(await checkIOSPermission());
      }
    } catch (e) {
      console.info(e);
    }

    watchId.current = setTimeout(() => {
      watch();
    }, 1000) as unknown as number;
  }, []);

  useEffect(() => {
    watch();
    return () => {
      watchId.current && clearTimeout(watchId.current);
    };
  }, [watch]);

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
