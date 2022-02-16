import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Card, Text} from 'react-native-paper';
import ARMap from '../atoms/ARMap';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  mapContainer: {
    height: 160,
    overflow: 'hidden',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});

export interface ARRouteItemProps extends ViewProps {}

export default ({style}: ARRouteItemProps) => {
  return (
    <Card style={style}>
      <View style={styles.mapContainer}>
        <ARMap />
      </View>
      <View style={styles.container}>
        <Text>Je suis un itinéraire</Text>
      </View>
    </Card>
  );
};
