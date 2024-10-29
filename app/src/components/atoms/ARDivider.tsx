import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '@theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {},
  line: {
    flex: 1,
    height: 1,
  },
});

export interface ARDividerProp {
  text: string;
  lineColor?: string;
  textColor?: string;
}

export default ({
  text,
  textColor = theme.colors.grey[300],
  lineColor = theme.colors.grey[50],
}: ARDividerProp) => {
  const buildStyle = () => {
    return {
      text: StyleSheet.flatten([styles.text, { color: textColor }]),
      line: StyleSheet.flatten([styles.line, { backgroundColor: lineColor }]),
    };
  };

  const buildedStyles = buildStyle();

  return (
    <View style={styles.container}>
      <View style={buildedStyles.line} />
      <Text style={buildedStyles.text}>{text}</Text>
      <View style={buildedStyles.line} />
    </View>
  );
};
