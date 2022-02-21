import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { POI } from '../../actions/poi';
import ARMap from '../atoms/ARMap';
import ARListItem from '../molecules/ARListItem';
import ARForecasts from '../molecules/ARForecasts';
import { POIMarker } from './ARMapView';
import { Card } from 'react-native-paper';

const styles = StyleSheet.create({
  map: { height: 300, borderRadius: 5, margin: 15, overflow: 'hidden' },
});

type AppStackParamList = {
  Details: { poiDetails: POI };
};

type POIDetailsRouteProp = RouteProp<AppStackParamList>;

const ARPOIDetails = () => {
  const { params } = useRoute<POIDetailsRouteProp>();

  return (
    <ScrollView>
      {params && params.poiDetails && (
        <>
          <Card style={styles.map}>
            <View style={{ flex: 1 }}>
              <ARMap userLocationVisible interactionEnabled heatmapVisible>
                <POIMarker {...params.poiDetails} />
              </ARMap>
            </View>
          </Card>
          <ARListItem poi={params.poiDetails} marginBottom={25} />
          <ARForecasts poi={params.poiDetails} />
        </>
      )}
    </ScrollView>
  );
};

export default ARPOIDetails;
