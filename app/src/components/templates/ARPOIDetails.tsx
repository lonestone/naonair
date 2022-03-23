import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Card, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { reverse } from '../../actions/poi';
import { RouteProfile } from '../../actions/routes';
import { theme } from '../../theme';
import {
  StackNavigationScreenProp,
  StackParamList,
  TabNavigationScreenProp,
} from '../../types/routes';
import logger from '../../utils/logger';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARMap from '../atoms/ARMap';
import ARQAChip from '../atoms/ARQAChip';
import ARHeadingGroup from '../molecules/ARHeadingGroup';
import ARForecasts from '../organisms/ARForecasts';
import { POIMarker } from './ARMapView';

const styles = StyleSheet.create({
  map: {
    height: 300,
    borderRadius: 16,
  },
  chipWrapper: {
    position: 'absolute',
    bottom: -20,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  description: {
    color: theme.colors.blue[300],
    lineHeight: 24,
    fontSize: 16,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.blue[500],
    fontSize: 18,
  },
  scrollView: {
    backgroundColor: 'white',
  },
  detailView: {
    margin: 15,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flex: 1,
  },
  mapView: { flex: 1, borderRadius: 16, overflow: 'hidden' },
});

type POIDetailsRouteProp = RouteProp<StackParamList, 'POIDetails'>;

const ARPOIDetails = () => {
  const navigation = useNavigation<TabNavigationScreenProp>();
  const { poi } = useRoute<POIDetailsRouteProp>().params || {};

  const goTo = () => {
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        reverse([coords.longitude, coords.latitude]).then(features => {
          if (features.length > 0) {
            const { text_fr = 'Ma position' } = features[0];
            navigation.navigate('Itinéraires', {
              start: {
                text: text_fr,
                coord: [coords.longitude, coords.latitude],
              },
              end: {
                text: poi.name,
                coord: poi.geolocation,
              },
            });
          }
        });
      },
      error => {
        logger.error(error, 'getCurrentPosition');
      },
      { timeout: 20000, enableHighAccuracy: true, maximumAge: 1000 },
    );
  };

  const [isMapLoaded, setMapLoaded] = useState<boolean>(false);

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {poi && (
          <View style={styles.detailView}>
            <View>
              <Card style={styles.map}>
                <View style={styles.mapView}>
                  <ARMap
                    userLocationVisible
                    interactionEnabled
                    heatmapVisible
                    onMapLoaded={() => setMapLoaded(true)}
                    center={poi.geolocation}>
                    {isMapLoaded && <POIMarker poi={poi} />}
                  </ARMap>
                </View>
                <View style={styles.chipWrapper}>
                  <ARQAChip
                    size="md"
                    shadow
                    coord={poi.geolocation}
                    value={poi.qa}
                  />
                </View>
              </Card>
            </View>
            <ARHeadingGroup title={poi.name} caption={poi.address} />
            <Divider />
            {poi.poi_id && <ARForecasts id={poi.poi_id} />}
          </View>
        )}
      </ScrollView>
      {poi && (
        <ARButton
          size={ARButtonSize.Medium}
          styleContainer={styles.button}
          onPress={goTo}
          icon={({ color }) => (
            <Icon name="navigation-variant" size={25} color={color} />
          )}
          label="Me rendre à cet endroit"
        />
      )}
    </>
  );
};

export default ARPOIDetails;
