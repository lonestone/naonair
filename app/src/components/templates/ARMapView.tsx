/// <reference path="../../custom.d.ts" />

import MapboxGL from '@react-native-mapbox-gl/maps';
import { useNavigation } from '@react-navigation/native';
import React, { createRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { POI, poiIcons } from '../../actions/poi';
import { QAType } from '../../actions/qa';
import markerBackground from '../../assets/marker-background.svg';

import { useQAs } from '../../hooks/useQA';
import { StackNavigationScreenProp } from '../../types/routes';
import ARMap from '../atoms/ARMap';
import ARProgress from '../atoms/ARProgress';
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

export const POIMarker = ({
  poi,
  qa,
  isLoading,
}: {
  poi: POI;
  qa?: QAType | null;
  isLoading?: boolean;
}) => {
  const navigation = useNavigation<StackNavigationScreenProp>();
  const annotationRef = createRef<MapboxGL.PointAnnotation>();

  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    annotationRef.current?.refresh();
  }, [qa, annotationRef]);

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
        {isLoading == true ? (
          <ActivityIndicator size={13} style={{ top: -2 }} />
        ) : (
          <SvgXml
            width="20"
            height="20"
            fill={qa?.main || '#25244E'}
            style={styles.markerIcon}
            xml={poiIcons[poi.category] || null}
          />
        )}
      </View>
    </MapboxGL.PointAnnotation>
  );
};

export default ({ pois }: ARMapViewProps) => {
  const [isMapLoaded, setMapLoaded] = useState<boolean>(false);
  const [isLegendDeployed, setIsLegendDeployed] = useState<boolean>(false);

  const { count = 0, QAs } = useQAs(pois.map(({ geolocation }) => geolocation));

  return (
    <>
      <ARMap
        userLocationVisible
        interactionEnabled
        heatmapVisible
        onMapPress={() => setIsLegendDeployed(false)}
        onMapLoaded={() => setMapLoaded(true)}>
        {isMapLoaded &&
          pois.map((poi, i) => (
            <POIMarker key={`poi-${poi.id}`} poi={poi} qa={QAs[i]} />
          ))}
      </ARMap>
      {count < pois.length && (
        <ARProgress percent={count / pois.length} label="Chargement des POIs" />
      )}

      <ARLegend
        onToggle={() => setIsLegendDeployed(!isLegendDeployed)}
        isDeployed={isLegendDeployed}
        style={styles.legends}
      />
      <ARUserLocationAlert />
    </>
  );
};
