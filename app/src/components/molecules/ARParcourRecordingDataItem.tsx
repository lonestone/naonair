import React, { useMemo } from 'react';

import { StyleSheet, View, ViewProps } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '@theme';

type ARParcourRecordingDataItemProps = {
  title: string;
  value: string;
  size?: 'sm' | 'md' | 'lg';
} & ViewProps;

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.blue[300],
  },
  value: {
    color: theme.colors.blue[500],
    fontWeight: 'bold',
  },
  titleSm: {
    fontSize: 14,
  },
  titleMd: {
    fontSize: 16,
  },
  titleLg: {
    fontSize: 20,
  },
  valueSm: {
    fontSize: 18,
  },
  valueMd: {
    fontSize: 24,
  },
  valueLg: {
    fontSize: 32,
  },
});

export default ({
  title,
  value,
  size,
  ...props
}: ARParcourRecordingDataItemProps) => {
  const titleStyle = useMemo(() => {
    switch (size) {
      case 'sm':
        return style.titleSm;
      case 'md':
        return style.titleMd;
      case 'lg':
        return style.titleLg;
      default:
        return style.titleMd;
    }
  }, [size]);

  const valueStyle = useMemo(() => {
    switch (size) {
      case 'sm':
        return style.valueSm;
      case 'md':
        return style.valueMd;
      case 'lg':
        return style.valueLg;
      default:
        return style.valueMd;
    }
  }, [size]);

  return (
    <View {...props} style={StyleSheet.flatten([style.container, props.style])}>
      <Text style={StyleSheet.flatten([style.title, titleStyle])}>{title}</Text>
      <Text style={StyleSheet.flatten([style.value, valueStyle])}>{value}</Text>
    </View>
  );
};
