import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Card, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addToFavorites, removeFromFavorites } from '../../actions/favorites';
import { reverse } from '../../actions/poi';
import { theme } from '@theme';
import { StackParamList, TabNavigationScreenProp } from '@type/routes';
import logger from '@utils/logger';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARMap from '../atoms/ARMap';
import ARQAChip from '../atoms/ARQAChip';
import BackButton from '@molecules/ARBackButton';
import ARCommonHeader from '@molecules/ARCommonHeader';
import FavoriteButton from '@molecules/ARFavoriteButton';
import ARHeadingGroup from '@molecules/ARHeadingGroup';
import ARForecasts from '../organisms/ARGeoserverForecasts';
import ARPollution from '../organisms/ARPollution';
import { POIMarker } from './ARMapView';
import analytics from '@react-native-firebase/analytics';
import ARGeoserverForecasts from '../organisms/ARGeoserverForecasts';

const styles = StyleSheet.create({
  map: {
    height: 300,
    alignSelf: 'stretch',
    flex: 0,
    borderRadius: 16,
    overflow: 'hidden',
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
  mapView: { flex: 1, borderRadius: 16 },
});

type POIDetailsRouteProp = RouteProp<StackParamList, 'POIDetails'>;

const ARPOIDetails = () => {
  const navigation = useNavigation<TabNavigationScreenProp>();
  const { poi } = useRoute<POIDetailsRouteProp>().params || {};
  const [favorited, setFavorited] = useState(poi.favorited);

  const goTo = async () => {
    try {
      await analytics().logEvent('me_rendre_a_cet_endroit_button', {
        name: poi.name,
        id: poi.id,
        address: poi.address,
      });
    } catch (e) {
      console.warn(e);
    }

    navigation.navigate('Itinéraires', {
      end: {
        text: poi.name,
        coord: poi.geolocation,
      },
    });

    // Geolocation.getCurrentPosition(
    //   ({ coords }) => {
    //     reverse([coords.longitude, coords.latitude]).then(features => {
    //       if (features.length > 0) {
    //         const { text_fr = 'Ma position' } = features[0];
    //         navigation.navigate('Itinéraires', {
    //           start: {
    //             text: text_fr,
    //             coord: [coords.longitude, coords.latitude],
    //           },
    //           end: {
    //             text: poi.name,
    //             coord: poi.geolocation,
    //           },
    //         });
    //       }
    //     });
    //   },
    //   error => {
    //     logger.error(error, 'getCurrentPosition');
    //   },
    //   { timeout: 20000, enableHighAccuracy: true, maximumAge: 1000 },
    // );
  };

  const [isMapLoaded, setMapLoaded] = useState<boolean>(false);

  const toggleFavorited = async () => {
    setFavorited(value => !value);
    favorited ? await removeFromFavorites(poi) : await addToFavorites(poi);
  };

  return (
    <>
      <ARCommonHeader
        headline="Détails"
        left={<BackButton />}
        right={
          <FavoriteButton isFavorited={favorited} onPress={toggleFavorited} />
        }
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {poi && (
          <View style={styles.detailView}>
            <View>
              <Card style={styles.mapView}>
                <View>
                  <ARMap
                    userLocationVisible
                    interactionEnabled
                    heatmapVisible
                    style={styles.map}
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
            {poi.poi_id && (
              <>
                <Divider />
                <ARPollution poi={poi} />
                <Divider />
                <ARGeoserverForecasts id={poi.poi_id} type="aireel:poi_data" />
              </>
            )}
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
