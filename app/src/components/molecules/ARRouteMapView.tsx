import MapboxGL, { LineLayerStyle } from '@react-native-mapbox-gl/maps';
import { BBox, Feature, Geometry, Position } from 'geojson';
import React, { createRef, forwardRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ARPath } from '../../actions/routes';
import { theme } from '../../theme';
import ARMap from '../atoms/ARMap';

export interface ARRouteMapViewProps {
  paths: ARPath[];
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

const lineStyle: LineLayerStyle = {
  lineColor: theme.colors.blue[500],
  lineWidth: 4,
  lineJoin: 'round',
  lineCap: 'round',
};

const StartMarker = ({ position }: { position: Position }) => {
  return (
    <MapboxGL.MarkerView
      id="start-marker-1"
      title="Start"
      coordinate={position}>
      <View style={styles.startMarker} />
    </MapboxGL.MarkerView>
  );
};

const EndMarker = forwardRef<MapboxGL.MarkerView, { position: Position }>(
  ({ position }, ref) => {
    console.info(position);
    return (
      <MapboxGL.MarkerView ref={ref} id="end-marker-1" coordinate={position}>
        <View
          style={styles.endMarker}
          onLayout={() => console.info('ONLAYOUT')}>
          <Icon
            name="flag"
            color={theme.colors.white}
            size={12}
            style={styles.endMarkerIcon}
          />
        </View>
      </MapboxGL.MarkerView>
    );
  },
);

export default ({ paths, bbox, start, end }: ARRouteMapViewProps) => {
  const endMarkerRef = createRef<MapboxGL.MarkerView>();

  // HACK to prevent draw PointAnnotation before the map is loaded
  // If not, PointAnnotation will be render outside the bbox and has incorrect values
  const [isMapLoaded, setMapLoaded] = useState<boolean>();

  return (
    <ARMap
      // interactionEnabled
      bbox={bbox}
      onMapLoaded={() => {
        console.info('refresh');
        setMapLoaded(true);
      }}>
      {isMapLoaded && (
        <>
          <StartMarker position={start} />
          <EndMarker ref={endMarkerRef} position={end} />
          {paths.length > 0 && (
            <MapboxGL.ShapeSource
              id="source"
              lineMetrics
              shape={
                {
                  type: 'Feature',
                  geometry: paths[0].points,
                } as Feature<Geometry>
              }>
              <MapboxGL.LineLayer id="route" style={lineStyle} />
            </MapboxGL.ShapeSource>
          )}
        </>
      )}
    </ARMap>
  );
};
