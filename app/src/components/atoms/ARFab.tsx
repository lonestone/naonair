import React from 'react';
import { FAB } from 'react-native-paper';
import { theme } from '../../theme';
import { StyleSheet } from 'react-native';

type ARFabProps = React.ComponentProps<typeof FAB>;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
});

export const ARFab = (props: ARFabProps) => {
  return (
    <FAB
      style={StyleSheet.flatten([styles.fab, props.style])}
      color="white"
      {...props}
    />
  );
};
