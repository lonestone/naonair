import MapboxGL, { LineLayerStyle } from '@maplibre/maplibre-react-native';
import { Feature, Geometry } from 'geojson';
import React, { useEffect } from 'react';
import { ARParcours } from '../../actions/parcours';
import { ARPath } from '../../actions/routes';
import { theme } from '@theme';

const lineStyle: LineLayerStyle = {
  lineColor: theme.colors.blue[500],
  lineWidth: 4,
  lineJoin: 'round',
  lineCap: 'round',
};

export interface ARPathLayerProp {
  path: ARPath | ARParcours;
  id?: string;
  isSelected?: boolean;
}

export default ({ path, id, isSelected }: ARPathLayerProp) => {
  const line = (): LineLayerStyle => {
    return {
      ...lineStyle,
      lineColor:
        isSelected === false ? theme.colors.grey[100] : theme.colors.blue[500],
    };
  };

  return (
    <MapboxGL.ShapeSource
      id={`source-${id}`}
      lineMetrics
      shape={
        {
          type: 'Feature',
          geometry: path.points || path.geometry,
        } as Feature<Geometry>
      }>
      <MapboxGL.LineLayer id={`route-${id}`} style={line()} />
    </MapboxGL.ShapeSource>
  );
};
