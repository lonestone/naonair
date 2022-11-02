import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useSnackbar from '../../contexts/snackbar.context';
import { fonts } from '../../theme';

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', top: 0 },
  label: { ...fonts.Lato.semibold, fontSize: 15, color: 'white' },
  content: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconMargin: { marginRight: 10 },
});

export interface ARSnackbarProps {
  icon?: string;
  label?: string;
  backgroundColor?: string;
  isVisible: boolean;
}

const ARSnackbar = () => {
  const { snackbarProps, setSnackbarStatus } = useSnackbar();

  const handleClose = () => {
    setSnackbarStatus?.({ isVisible: false });
  };

  return (
    <>
      {snackbarProps && (
        <Snackbar
          wrapperStyle={styles.wrapper}
          style={{ backgroundColor: snackbarProps.backgroundColor }}
          visible={snackbarProps.isVisible}
          duration={2000}
          onDismiss={handleClose}>
          <View style={styles.content}>
            <View style={styles.iconMargin}>
              <Icon name={snackbarProps.icon!} size={20} color="white" />
            </View>
            <Text style={styles.label} numberOfLines={5}>
              {snackbarProps.label}
            </Text>
          </View>
        </Snackbar>
      )}
    </>
  );
};

export default ARSnackbar;
