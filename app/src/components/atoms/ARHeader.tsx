import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';

export interface HeaderProps {
  children: ReactElement;
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 18,
    borderBottomColor: theme.colors.accent,
    borderBottomWidth: 1,
    // borderColor: theme.colors.accent,
    // borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: { height: 8, width: 0 },
    shadowRadius: 10,
    zIndex: 42,
    backgroundColor: 'white',
    elevation: 8,
    shadowOpacity: 0.1,
  },
});

export default ({ children, style }: HeaderProps) => {
  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <SafeAreaView edges={['top', 'left', 'right']}>{children}</SafeAreaView>
    </View>
  );
};
