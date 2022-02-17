import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {POI} from '../../actions/poi';
import {theme} from '../../theme';
import ARMap from '../atoms/ARMap';
import {POIMarker} from './ARMapView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  map: {height: 300, width: 350, borderRadius: 2},
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.blue[500],
  },
  address: {
    fontSize: 16,
    color: theme.colors.blue[300],
    lineHeight: 24,
  },
});

type AppStackParamList = {
  Details: {poiDetails: POI};
};

type POIDetailsRouteProp = RouteProp<AppStackParamList>;

const ARPOIDetails = () => {
  const {params} = useRoute<POIDetailsRouteProp>();

  return (
    <View style={styles.container}>
      {params && params.poiDetails && (
        <>
          <View style={styles.map}>
            <ARMap userLocationVisible interactionEnabled heatmapVisible>
              <POIMarker {...params.poiDetails} />
            </ARMap>
          </View>
          <Text style={styles.name}>{params.poiDetails.name}</Text>
          <Text style={styles.address}>{params.poiDetails.adress}</Text>
          <Divider />
        </>
      )}
    </View>
  );
};

export default ARPOIDetails;
