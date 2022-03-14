import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import {
  checkAndroidPermission,
  checkIOSPermission,
} from '../../actions/location';
import { fonts, theme } from '../../theme';

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 0,
    margin: 0,
  },
  title: {
    ...fonts.Raleway.bold,
    color: theme.colors.blue[500],
    margin: 0,
  },
  paragraph: {
    ...fonts.Lato.regular,
    color: theme.colors.blue[500],
  },
  button: {
    backgroundColor: theme.colors.primary,
  },
  buttonLabel: {
    ...fonts.Lato.bold,
    color: theme.colors.white,
  },
});

export default () => {
  const [userLocationEnabled, setUserLocationEnabled] = useState<boolean>(true);

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
      <Dialog visible={!userLocationEnabled} style={styles.modal}>
        <Dialog.Title style={styles.title}>
          Impossible de vous trouver
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.paragraph}>
            Pour obtenir une meilleure expérience, activez le gps de l'appareil
            et autorisez l'accès à votre position.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={styles.button}
            labelStyle={styles.buttonLabel}
            onPress={() => {
              Linking.openSettings();
            }}>
            Ouvrir les réglages
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  ) : null;
};
