/// <reference path="../../custom.d.ts" />

import MapboxGL from '@react-native-mapbox-gl/maps';
import { useNavigation } from '@react-navigation/native';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { POI, poiIcons } from '../../actions/poi';
import { getQAFromPosition, QAType } from '../../actions/qa';
import markerBackground from '../../assets/marker-background.svg';
import { StackNavigationScreenProp } from '../../types/routes';
import ARMap from '../atoms/ARMap';
import ARLegend from '../molecules/ARLegend';
import ARUserLocationAlert from './ARUserLocationAlert';

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
    shadowOpacity: 0.2,
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

export const POIMarker = ({ poi }: { poi: POI }) => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const annotationRef = createRef<MapboxGL.PointAnnotation>();
  const [qa, setQA] = useState<QAType | undefined>();
  const [selected, setSelected] = useState<boolean>(false);

  const getQA = useCallback(async () => {
    const temp = await getQAFromPosition(poi.geolocation);

    setQA(temp);
  }, [poi]);

  useEffect(() => {
    annotationRef.current?.refresh();
  }, [qa, annotationRef]);

  useEffect(() => {
    getQA();
  }, [getQA]);

  return (
    <MapboxGL.PointAnnotation
      ref={annotationRef}
      coordinate={poi.geolocation}
      anchor={{ x: 0.5, y: 1 }}
      title={poi.name}
      selected={selected}
      onSelected={() => {
        navigation.navigate('POIDetails', { poi });

        // HACK to be sure the user can press on annotation twice in a row
        // For any complaint create an issue here : https://github.com/rnmapbox/maps/issues
        setSelected(true);
        setTimeout(() => setSelected(false));
      }}
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
          xml={poiIcons[poi.category] || null}
        />
      </View>
    </MapboxGL.PointAnnotation>
  );
};

export default ({ pois }: ARMapViewProps) => {
  const [isMapLoaded, setMapLoaded] = useState<boolean>(false);
  const [isLegendDeployed, setIsLegendDeployed] = useState<boolean>(false);

  return (
    <>
      <ARMap
        userLocationVisible
        interactionEnabled
        heatmapVisible
        onMapPress={() => setIsLegendDeployed(false)}
        onMapLoaded={() => setMapLoaded(true)}>
        {isMapLoaded &&
          pois.map(poi => <POIMarker key={`poi-${poi.id}`} poi={poi} />)}
      </ARMap>
      <ARLegend
        onToggle={() => setIsLegendDeployed(!isLegendDeployed)}
        isDeployed={isLegendDeployed}
        style={styles.legends}
      />
      <ARUserLocationAlert />
    </>
  );
};
