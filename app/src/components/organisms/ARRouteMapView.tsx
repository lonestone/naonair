import { BBox, Position } from 'geojson';
import React, { useState } from 'react';
import { ARPath } from '../../actions/routes';
import ARMap from '../atoms/ARMap';
import ARPathLayer from '../atoms/ARPathLayer';
import ARPathMarker, { ARPathMarkerType } from '../atoms/ARPathMarker';

export interface ARRouteMapViewProps {
  paths: ARPath[];
  bbox?: BBox;
  start?: Position;
  end?: Position;
}

export default ({ paths, bbox, start, end }: ARRouteMapViewProps) => {
  // HACK to prevent draw PointAnnotation before the map is loaded
  // If not, PointAnnotation will be render outside the bbox and has incorrect values
  const [isMapLoaded, setMapLoaded] = useState<boolean>();

  return (
    <ARMap
      interactionEnabled
      bbox={paths.length > 0 ? paths[0].bbox : bbox}
      onMapLoaded={() => setMapLoaded(true)}>
      {isMapLoaded && (
        <>
          {paths.map((path, index) => (
            <ARPathLayer key={`path-${index}`} path={path} />
          ))}
          {start && (
            <ARPathMarker
              coordinate={start}
              id="start-marker-1"
              title="Start"
              type={ARPathMarkerType.START}
            />
          )}
          {end && (
            <ARPathMarker
              coordinate={end}
              id="end-marker-1"
              title="End"
              type={ARPathMarkerType.END}
            />
          )}
        </>
      )}
    </ARMap>
  );
};
