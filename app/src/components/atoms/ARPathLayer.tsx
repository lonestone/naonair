import MapboxGL, { LineLayerStyle } from '@react-native-mapbox-gl/maps';
import { Feature, Geometry } from 'geojson';
import React from 'react';
import { ARParcours } from '../../actions/parcours';
import { ARPath } from '../../actions/routes';
import { theme } from '../../theme';

const lineStyle: LineLayerStyle = {
  lineColor: theme.colors.blue[500],
  lineWidth: 4,
  lineJoin: 'round',
  lineCap: 'round',
};

export interface ARPathLayerProp {
  path: ARPath | ARParcours;
  id: string;
  isSelected: boolean;
  aboveLayerId?: string;
}

export default ({ path, id, isSelected, aboveLayerId }: ARPathLayerProp) => {
  const line = (): LineLayerStyle => {
    return {
      ...lineStyle,
      lineColor: isSelected ? theme.colors.blue[500] : theme.colors.grey[100],
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
      <MapboxGL.LineLayer
        id={`route-${id}`}
        style={line()}
        aboveLayerID={
          isSelected && !!aboveLayerId ? `route-${aboveLayerId}` : undefined
        }
      />
    </MapboxGL.ShapeSource>
  );
};
