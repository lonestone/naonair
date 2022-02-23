import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { theme } from '../../theme';
import { StackParamList } from '../../types/routes';
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  mapView: { flex: 1, borderRadius: 16, overflow: 'hidden' },
});

type POIDetailsRouteProp = RouteProp<StackParamList, 'Details'>;

const ARPOIDetails = () => {
  const { poiDetails } = useRoute<POIDetailsRouteProp>().params || {};

  return (
    <ScrollView style={styles.scrollView}>
      {poiDetails && (
        <View style={styles.detailView}>
          <View>
            <Card style={styles.map}>
              <View style={styles.mapView}>
                <ARMap
                  userLocationVisible
                  interactionEnabled
                  heatmapVisible
                  center={poiDetails.geolocation}>
                  <POIMarker poi={poiDetails} />
                </ARMap>
              </View>
              <View style={styles.chipWrapper}>
                <ARQAChip
                  size="md"
                  shadowStyle={styles.shadow}
                  coord={poiDetails.geolocation}
                />
              </View>
            </Card>
          </View>
          <ARHeadingGroup title={poiDetails.name} caption={poiDetails.adress} />
          <Divider />
          <ARForecasts forecastQA />
        </View>
      )}
    </ScrollView>
  );
};

export default ARPOIDetails;
