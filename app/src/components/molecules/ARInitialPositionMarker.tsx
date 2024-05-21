import React from 'react';

import MapboxGL from '@maplibre/maplibre-react-native';
import { Position } from 'geojson';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import markerBackground from '../../assets/marker-background.svg';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  markerContainer: {
    overflow: 'visible',
    width: 40,
    height: 46,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  markerBackground: {
    position: 'absolute',
  },
});

type InitialPositionMarkerProps = {
  position: Position;
};

const InitialPositionMarker = ({ position }: InitialPositionMarkerProps) => {
  return (
    <MapboxGL.PointAnnotation id="initialPosition" coordinate={position}>
      <View style={styles.markerContainer}>
        <SvgXml
          width="40"
          height="46"
          fill={'black'}
          xml={markerBackground}
          style={styles.markerBackground}
        />
        <Icon
          style={{
            marginTop: -5,
            marginLeft: 2,
          }}
          color={'white'}
          size={25}
          name="flag"
        />
      </View>
    </MapboxGL.PointAnnotation>
  );
};

export default InitialPositionMarker;
