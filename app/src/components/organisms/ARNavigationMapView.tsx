import MapboxGL from '@react-native-mapbox-gl/maps';
import { Position } from '@turf/turf';
import React, { createRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ARPath } from '../../actions/routes';
import ARMap, { ARMapHandle } from '../atoms/ARMap';
import ARPathLayer from '../atoms/ARPathLayer';
import ARPathMarker, { ARPathMarkerType } from '../atoms/ARPathMarker';

export interface ARNavigationMapViewProp {
  path: ARPath;
  style?: StyleProp<ViewStyle>;
  onUserMoved: (coord: Position) => void;
}

export default ({ path, style, onUserMoved }: ARNavigationMapViewProp) => {
  const mapRef = createRef<ARMapHandle>();

  const { points } = path;
  console.info({ path });

  const start = points.coordinates[0];
  const end = points.coordinates[points.coordinates.length - 1];

  const onUserLocationChanged = ({ coords }: MapboxGL.Location) => {
    console.info('onUserLocationChanged 2', coords, mapRef);
    const userPosition = [coords.longitude, coords.latitude];
    mapRef.current?.setCamera({
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
      ref={mapRef}
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
