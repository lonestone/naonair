import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Caption, Dialog, Paragraph, Portal, Provider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../theme';
import {ARButton, ARButtonSize} from '../atoms/ARButton';
import {ARLink} from '../atoms/ARLink';

type NewsDialogType = {
  visible: boolean;
  onClose: any;
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 20,
    padding: 8,
  },
  title: {
    display: 'flex',
    fontWeight: '700',
    fontSize: 20,
    color: theme.colors.primary,
  },

  content: {
    fontWeight: '400',
    fontSize: 14,
    color: theme.colors.primary,
  },
  link: {
    marginTop: 16,
  },
});

export const NewsDialog = ({onClose}: NewsDialogType) => {
  return (
    <Provider>
      <View>
        <Portal>
          <Dialog visible={true} style={styles.dialog} /* onDismiss={onClose}*/>
            <Dialog.Title style={styles.title}>
              <Icon name="today" size={30} />
              Titre de la news
            </Dialog.Title>
            <Dialog.Content>
              <Caption>Du 19/10/2021 au 21/10/2021</Caption>
              <Paragraph style={styles.content}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam.
              </Paragraph>
              <View style={styles.link}>
                <ARLink label="Titre du lien" url="https://perdu.com" />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <ARButton
                label={"C'est noté"}
                onPress={onClose}
                size={ARButtonSize.Small}
              />
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};
