import { BBox, Position } from 'geojson';
import React, { useState } from 'react';
import { ARRoute } from '../../actions/routes';
import ARMap from '../atoms/ARMap';
import ARPathLayer from '../atoms/ARPathLayer';
import ARPathMarker, { ARPathMarkerType } from '../atoms/ARPathMarker';
import { ARRouteType } from '../templates/ARChooseItinerary';

export interface ARRouteMapViewProps {
  route?: ARRoute;
  bbox: BBox;
  start?: Position;
  end?: Position;
  selected: ARRouteType;
}

export default ({ route, bbox, start, end, selected }: ARRouteMapViewProps) => {
  // HACK to prevent draw PointAnnotation before the map is loaded
  // If not, PointAnnotation will be render outside the bbox and has incorrect values
  const [isMapLoaded, setMapLoaded] = useState<boolean>();

  console.info({ selected });

  const paths_key: ['cleanest_path', 'fastest_path'] = [
    'cleanest_path',
    'fastest_path',
  ];

  // sort paths to make the selected one above the others
  const paths = paths_key
    .sort(key => (key === selected ? 1 : -1))
    .map(
      key =>
        route && (
          <ARPathLayer
            id={key}
            path={route![key]}
            isSelected={selected === key}
          />
        ),
    );

  return (
    <ARMap
      interactionEnabled
      bbox={bbox}
      onMapLoaded={() => setMapLoaded(true)}>
      {isMapLoaded && (
        <>
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
          {paths}
        </>
      )}
    </ARMap>
  );
};
