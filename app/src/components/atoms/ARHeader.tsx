import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface HeaderProps {
  children: ReactElement;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 16,
    shadowColor: 'black',
    shadowOffset: { height: 8, width: 0 },
    shadowRadius: 10,
    zIndex: 42,
    backgroundColor: 'white',
    // elevation: 3,
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
