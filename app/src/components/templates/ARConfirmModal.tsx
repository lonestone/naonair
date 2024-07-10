import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Headline, Modal, Paragraph } from 'react-native-paper';

import { fonts, theme } from '@theme';

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 5,
    paddingHorizontal: 24,
    paddingVertical: 26,
    paddingBottom: 20,
    marginHorizontal: 30,
    backgroundColor: theme.colors.white,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    ...fonts.Raleway.bold,
    overflow: 'hidden',
    flex: 0,
    fontSize: 20,
    lineHeight: 24,
    color: theme.colors.blue[500],
  },
  container: {
    marginLeft: 13,
    flex: 1,
  },
  paragraph: {
    marginTop: 10,
    color: theme.colors.blue[500],
  },
  content: {
    margin: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginVertical: 20,
  },
  button: {
    color: theme.colors.blue[500],
  },
});

interface Props {
  open: boolean;
  headline: string;
  caption: string;
  setOpen: (value: boolean) => void;
  onPress: () => void;
}

const ARConfirmClearStorage = ({
  open,
  setOpen,
  headline,
  caption,
  onPress,
}: Props) => {
  return (
    <Modal visible={open} dismissable onDismiss={() => setOpen(false)}>
      <View style={styles.dialog}>
        <Headline style={styles.title}>{headline}</Headline>
        <View style={styles.content}>
          <Paragraph style={styles.paragraph}>{caption}</Paragraph>
        </View>
        <View style={styles.buttonContent}>
          <Button labelStyle={styles.button} onPress={() => setOpen(false)}>
            NON
          </Button>
          <Button labelStyle={styles.button} onPress={onPress}>
            OUI
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default ARConfirmClearStorage;
