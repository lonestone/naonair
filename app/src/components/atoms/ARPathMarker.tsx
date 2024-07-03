import MapboxGL from '@maplibre/maplibre-react-native';
import { Position } from 'geojson';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import { theme } from '@theme';

export enum ARPathMarkerType {
  START,
  END,
}

export interface ARPathMarkerProp {
  id: string;
  title: string;
  coordinate: Position;
  type: ARPathMarkerType;
}

const styles = StyleSheet.create({
  startMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.blue[100],
    borderColor: theme.colors.blue[500],
    borderWidth: 5,
    flex: 0,
    position: 'relative',
  },
  endMarker: {
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue[500],
    flex: 0,
  },
  endMarkerIcon: {},
});

const StartMarker = () => <View style={styles.startMarker} />;
const EndMarker = () => (
  <View style={styles.endMarker}>
    <Icon
      name="flag"
      color={theme.colors.white}
      size={12}
      style={styles.endMarkerIcon}
    />
  </View>
);

export default ({ id, title, type, coordinate }: ARPathMarkerProp) => {
  return (
    <MapboxGL.PointAnnotation id={id} title={title} coordinate={coordinate}>
      <>
        {type === ARPathMarkerType.START && <StartMarker />}
        {type === ARPathMarkerType.END && <EndMarker />}
      </>
    </MapboxGL.PointAnnotation>
  );
};
