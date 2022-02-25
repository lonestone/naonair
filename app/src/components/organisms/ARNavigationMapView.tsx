import React from 'react';
import { ARPath } from '../../actions/routes';
import ARMap from '../atoms/ARMap';
import ARPathLayer from '../atoms/ARPathLayer';
import ARPathMarker, { ARPathMarkerType } from '../atoms/ARPathMarker';

export interface ARNavigationMapViewProp {
  path: ARPath;
}

export default ({ path }: ARNavigationMapViewProp) => {
  const { points } = path;

  const start = points.coordinates[0];
  const end = points.coordinates[points.coordinates.length - 1];

  return (
    <ARMap interactionEnabled userLocationVisible>
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
