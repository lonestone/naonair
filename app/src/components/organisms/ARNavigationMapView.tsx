import MapboxGL from '@react-native-mapbox-gl/maps';
import React, { createRef } from 'react';
import { ARPath } from '../../actions/routes';
import ARMap, { ARMapHandle } from '../atoms/ARMap';
import ARPathLayer from '../atoms/ARPathLayer';
import ARPathMarker, { ARPathMarkerType } from '../atoms/ARPathMarker';

export interface ARNavigationMapViewProp {
  path: ARPath;
}

export default ({ path }: ARNavigationMapViewProp) => {
  const mapRef = createRef<ARMapHandle>();

  const { points } = path;

  const start = points.coordinates[0];
  const end = points.coordinates[points.coordinates.length - 1];

  const onUserLocationChanged = ({ coords }: MapboxGL.Location) => {
    console.info('onUserLocationChanged 2', coords, mapRef);
    mapRef.current?.setCamera({
      centerCoordinate: [coords.longitude, coords.latitude],
      heading: coords.heading,
    });
  };

  return (
    <ARMap
      interactionEnabled
      userLocationVisible
      ref={mapRef}
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
