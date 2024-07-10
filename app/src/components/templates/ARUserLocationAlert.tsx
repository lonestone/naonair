import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import {
  checkAndroidPermission,
  checkIOSPermission,
} from '../../actions/location';
import { fonts, theme } from '@theme';

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
  backButton: {
    // backgroundColor: theme.colors.primary,
  },
  backButtonLabel: {
    ...fonts.Lato.bold,
    color: theme.colors.grey[300],
  },
});

type ARUserLocationAlertProps = {
  visible: boolean;
};

export default ({ visible }: ARUserLocationAlertProps) => {
  // const [userLocationEnabled, setUserLocationEnabled] = useState<boolean>(true);
  const { goBack } = useNavigation();

  // const watchId = useRef<number | null>();

  // const watch = useCallback(async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       await checkAndroidPermission();
  //     } else {
  //       setUserLocationEnabled(await checkIOSPermission());
  //     }
  //   } catch (e) {
  //     console.info(e);
  //   }

  //   watchId.current = setTimeout(() => {
  //     watch();
  //   }, 1000) as unknown as number;
  // }, []);

  // useEffect(() => {
  //   watch();
  //   return () => {
  //     watchId.current && clearTimeout(watchId.current);
  //   };
  // }, [watch]);

  return Platform.OS === 'ios' ? (
    <Portal>
      <Dialog visible={visible} style={styles.modal}>
        <Dialog.Title style={styles.title}>
          Impossible de vous trouver
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.paragraph}>
            Naonair ne pourra pas vous guider si vous ne l'avez pas autorisé à
            connaitre votre position
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={styles.backButton}
            labelStyle={styles.backButtonLabel}
            onPress={goBack}>
            Annuler
          </Button>
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
