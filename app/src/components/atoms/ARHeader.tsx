import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';

export interface HeaderProps {
  children: ReactElement;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderColor: theme.colors.accent,
    borderWidth: 1,
    shadowColor: theme.colors.accent,
    shadowOffset: { height: 8, width: 0 },
    shadowRadius: 10,
    zIndex: 42,
    backgroundColor: 'white',
    elevation: 1,
    shadowOpacity: 0.1,
  },
});

export default ({ children }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']}>{children}</SafeAreaView>
    </View>
  );
};
