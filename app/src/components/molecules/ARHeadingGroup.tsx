import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Title } from 'react-native-paper';
import { fonts, theme } from '@theme';

const styles = StyleSheet.create({
  container: { marginTop: 35, marginLeft: 0, marginBottom: 35 },
  title: {
    color: theme.colors.blue[500],
    fontSize: 18,
    lineHeight: 24,
    ...fonts.Raleway.bold,
  },
  caption: {
    color: theme.colors.blue[300],
    fontSize: 16,
    lineHeight: 24,
    ...fonts.Lato.regular,
  },
});

interface Props {
  title: string;
  caption: string;
}

const ARHeadingGroup = ({ title, caption }: Props) => {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>{title}</Title>
      <Caption style={styles.caption}>{caption}</Caption>
    </View>
  );
};

export default ARHeadingGroup;
