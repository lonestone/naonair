/// <reference path="../../custom.d.ts" />

import MapLibreGL from '@maplibre/maplibre-react-native';
import { useNavigation } from '@react-navigation/native';
import { Position } from '@turf/turf';
import React, { createRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { SvgXml } from 'react-native-svg';
import { POI, poiIcons } from '../../actions/poi';
import markerBackground from '@assets/marker-background.svg';
import { useQA } from '@hooks/useQA';
import { StackNavigationScreenProp } from '@type/routes';
import ARMap from '../atoms/ARMap';
import ARLegend from '@molecules/ARLegend';
import analytics from '@react-native-firebase/analytics';

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
  const annotationRef = createRef<MapLibreGL.PointAnnotation>();

  const [selected, setSelected] = useState<boolean>(false);
  const [qa] = useQA(poi.geolocation, poi.qa);

  return (
    <MapLibreGL.PointAnnotation
      ref={annotationRef}
      coordinate={poi.geolocation}
      anchor={{ x: 0.5, y: 1 }}
      title={poi.name}
      selected={selected}
      onSelected={async () => {
        await analytics().logEvent('select_poi_from_map', {
          name: poi.name,
          id: poi.id,
          address: poi.address,
        });

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
    </MapLibreGL.PointAnnotation>
  );
};

export default ({ pois }: ARMapViewProps) => {
  const [isMapLoaded, setMapLoaded] = useState<boolean>(false);
  const [isLegendDeployed, setIsLegendDeployed] = useState<boolean>(false);
  const [center, setCenter] = useState<Position | undefined>();

  useEffect(() => {
    Geolocation.getCurrentPosition(({ coords }) => {
      setCenter([coords.longitude, coords.latitude]);
    });
  }, [setCenter]);

  return (
    <>
      <ARMap
        userLocationVisible
        interactionEnabled
        heatmapVisible
        center={center}
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
      {/* <ARUserLocationAlert /> */}
    </>
  );
};
