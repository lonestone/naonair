import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Title } from 'react-native-paper';
import { theme } from '../../theme';

const styles = StyleSheet.create({
  container: { marginTop: 35, marginLeft: 10, marginBottom: 35 },
  title: {
    color: theme.colors.blue[500],
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 24,
  },
  caption: {
    color: theme.colors.blue[300],
    fontSize: 16,
    lineHeight: 24,
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
