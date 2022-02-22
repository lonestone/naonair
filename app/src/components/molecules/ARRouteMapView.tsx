import MapboxGL, { LineLayerStyle } from '@react-native-mapbox-gl/maps';
import { BBox, Feature, Geometry, LineString, Position } from 'geojson';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme';
import ARMap from '../atoms/ARMap';

export interface ARRouteMapViewProps {
  points?: LineString;
  bbox?: BBox;
  start: Position;
  end: Position;
}

const styles = StyleSheet.create({
  startMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.blue[100],
    borderColor: theme.colors.blue[500],
    borderWidth: 5,
  },
  endMarker: {
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue[500],
  },
  endMarkerIcon: {},
});

const lineStyle: LineLayerStyle = {
  lineColor: theme.colors.blue[500],
  lineWidth: 4,
  lineJoin: 'round',
  lineCap: 'round',
};

const StartMarker = ({ position }: { position: Position }) => (
  <MapboxGL.MarkerView id="start" coordinate={[position[0], position[1]]}>
    <View style={styles.startMarker} />
  </MapboxGL.MarkerView>
);

const EndMarker = ({ position }: { position: Position }) => (
  <MapboxGL.MarkerView id="end" coordinate={[position[0], position[1]]}>
    <View style={styles.endMarker}>
      <Icon
        name="flag"
        color={theme.colors.white}
        size={12}
        style={styles.endMarkerIcon}
      />
    </View>
  </MapboxGL.MarkerView>
);

export default ({ points, bbox, start, end }: ARRouteMapViewProps) => {
  return (
    <ARMap interactionEnabled bbox={bbox}>
      {points && (
        <>
          <MapboxGL.ShapeSource
            id="souce"
            lineMetrics
            shape={
              {
                type: 'Feature',
                geometry: points,
              } as Feature<Geometry>
            }>
            <MapboxGL.LineLayer id="route" style={lineStyle} />
          </MapboxGL.ShapeSource>
          <StartMarker position={start} />
          <EndMarker position={end} />
        </>
      )}
    </ARMap>
  );
};
