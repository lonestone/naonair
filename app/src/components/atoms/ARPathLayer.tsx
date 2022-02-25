import MapboxGL, { LineLayerStyle } from '@react-native-mapbox-gl/maps';
import { Feature, Geometry } from 'geojson';
import React from 'react';
import { ARPath } from '../../actions/routes';
import { theme } from '../../theme';

const lineStyle: LineLayerStyle = {
  lineColor: theme.colors.blue[500],
  lineWidth: 4,
  lineJoin: 'round',
  lineCap: 'round',
};

export interface ARPathLayerProp {
  path: ARPath;
}

export default ({ path }: ARPathLayerProp) => (
  <MapboxGL.ShapeSource
    id="source"
    lineMetrics
    shape={
      {
        type: 'Feature',
        geometry: path.points,
      } as Feature<Geometry>
    }>
    <MapboxGL.LineLayer id="route" style={lineStyle} />
  </MapboxGL.ShapeSource>
);
