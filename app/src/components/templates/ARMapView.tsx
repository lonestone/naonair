/// <reference path="../../custom.d.ts" />

import MapboxGL from '@react-native-mapbox-gl/maps';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {POI, POICategory} from '../../actions/poi';
import cultureIcon from '../../assets/culture-icon.svg';
import marketIcon from '../../assets/market-icon.svg';
import sportIcon from '../../assets/sport-icon.svg';
import parkIcon from '../../assets/park-icon.svg';
import markerBackground from '../../assets/marker-background.svg';
import ARMap from '../atoms/ARMap';
import ARLegend from '../molecules/ARLegend';

export interface ARMapViewProps {
  pois: POI[];
}

const styles = StyleSheet.create({
  markerContainer: {
    overflow: 'visible',
    width: 40,
    height: 46,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  legends: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  markerBackground: {
    position: 'absolute',
  },
  markerIcon: {
    top: -2,
  },
});

const icons = {
  [`${POICategory.CULTURE}`]: cultureIcon,
  [`${POICategory.MARKET}`]: marketIcon,
  [`${POICategory.SPORT}`]: sportIcon,
  [`${POICategory.PARK}`]: parkIcon,
  [`${POICategory.UNDEFINED}`]: null,
};

const POIMarker = (poi: POI) => {
  return (
    <MapboxGL.PointAnnotation
      coordinate={[poi.geolocation.lon, poi.geolocation.lat]}
      anchor={{x: 0.5, y: 1}}
      id={`${poi.id}`}
      key={`poi-${poi.id}`}>
      <View style={styles.markerContainer}>
        <SvgXml
          width="40"
          height="46"
          xml={markerBackground}
          style={styles.markerBackground}
        />
        <SvgXml
          width="20"
          height="20"
          style={styles.markerIcon}
          xml={icons[`${poi.category}`]}
        />
      </View>
    </MapboxGL.PointAnnotation>
  );
};

export default ({pois}: ARMapViewProps) => {
  return (
    <>
      <ARMap>{pois.map(POIMarker)}</ARMap>
      <ARLegend style={styles.legends} />
    </>
  );
};