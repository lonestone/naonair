import MapLibreGL from '@maplibre/maplibre-react-native';
import { Position } from '@turf/turf';
import React, { createRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ARPath } from '../../actions/routes';
import ARMap from '../atoms/ARMap';
import ARPathLayer from '../atoms/ARPathLayer';
import ARPathMarker, { ARPathMarkerType } from '../atoms/ARPathMarker';

export interface ARNavigationMapViewProp {
  path: ARPath;
  style?: StyleProp<ViewStyle>;
  onUserMoved: (coord: Position) => void;
}

export default ({ path, onUserMoved }: ARNavigationMapViewProp) => {
  const cameraRef = createRef<MapLibreGL.CameraRef>();

  const { points } = path;

  const start = points.coordinates[0];
  const end = points.coordinates[points.coordinates.length - 1];

  const onUserLocationChanged = ({ coords }: MapLibreGL.Location) => {
    const userPosition = [coords.longitude, coords.latitude];
    cameraRef.current?.setCamera({
      centerCoordinate: userPosition,
      heading: coords.heading,
      animationMode: 'easeTo',
      animationDuration: 200,
    });
    onUserMoved(userPosition);
  };

  return (
    <ARMap
      interactionEnabled
      userLocationVisible
      isGPS
      cameraRef={cameraRef}
      cameraSettings={{ pitch: 30, zoomLevel: 17 }}
      onUserLocationChanged={onUserLocationChanged}>
      <>
        <ARPathMarker
          id="start"
          title="Start"
          coordinate={start}
          type={ARPathMarkerType.START}
        />

        <ARPathMarker
          id="end"
          title="End"
          coordinate={end}
          type={ARPathMarkerType.END}
        />

        <ARPathLayer path={path} />
      </>
    </ARMap>
  );
};
