/// <reference path="../../custom.d.ts" />

import MapboxGL from '@react-native-mapbox-gl/maps';
import { useNavigation } from '@react-navigation/native';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { POI, POICategory } from '../../actions/poi';
import { getQAFromPosition, QAType } from '../../actions/qa';
import cultureIcon from '../../assets/culture-icon.svg';
import favoriteIcon from '../../assets/favorite-icon.svg';
import markerBackground from '../../assets/marker-background.svg';
import marketIcon from '../../assets/market-icon.svg';
import parkIcon from '../../assets/park-icon.svg';
import sportIcon from '../../assets/sport-icon.svg';
import { StackNavigationScreenProp } from '../../types/routes';
import ARMap from '../atoms/ARMap';
import ARLegend from '../molecules/ARLegend';
import ARAlert from './ARAlert';
import ARNews from './ARNews';

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

export const icons = {
  [`${POICategory.CULTURE}`]: cultureIcon,
  [`${POICategory.MARKET}`]: marketIcon,
  [`${POICategory.SPORT}`]: sportIcon,
  [`${POICategory.PARK}`]: parkIcon,
  [`${POICategory.MY_PLACES}`]: favoriteIcon,
  [`${POICategory.UNDEFINED}`]: null,
};

export const POIMarker = ({ poi }: { poi: POI }) => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const annotationRef = createRef<MapboxGL.PointAnnotation>();
  const [qa, setQA] = useState<QAType | undefined>();

  const getQA = useCallback(async () => {
    const temp = await getQAFromPosition(poi.geolocation);
    setQA(temp);
  }, [poi]);

  useEffect(() => {
    getQA();
  }, [getQA]);

  return (
    <MapboxGL.MarkerView
      ref={annotationRef}
      coordinate={poi.geolocation}
      anchor={{ x: 0.5, y: 1 }}
      title={poi.name}
      onSelected={() => navigation.navigate('POIDetails', { poi })}
      id={`${poi.id}`}>
      <View style={styles.markerContainer}>
        <SvgXml
          width="40"
          height="46"
          fill={qa?.light || 'white'}
          xml={markerBackground}
          style={styles.markerBackground}
        />
        <SvgXml
          width="20"
          height="20"
          fill={qa?.main || '#25244E'}
          style={styles.markerIcon}
          xml={icons[`${poi.category}`]}
        />
      </View>
    </MapboxGL.MarkerView>
  );
};

export default ({ pois }: ARMapViewProps) => {
  const [isMapLoaded, setMapLoaded] = useState<boolean>(false);

  return (
    <>
      <ARMap
        userLocationVisible
        interactionEnabled
        heatmapVisible
        onMapLoaded={() => setMapLoaded(true)}>
        {isMapLoaded &&
          pois.map(poi => <POIMarker key={`poi-${poi.id}`} poi={poi} />)}
      </ARMap>
      <ARLegend style={styles.legends} />
      <ARAlert />
      <ARNews />
    </>
  );
};
