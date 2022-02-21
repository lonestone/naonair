import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { POI } from '../../actions/poi';
import { theme } from '../../theme';
import ARMap from '../atoms/ARMap';
import ARQAChip from '../atoms/ARQAChip';
import ARListItem from '../molecules/ARListItem';
import ARForecasts from '../organisms/ARForecasts';
import { POIMarker } from './ARMapView';

const styles = StyleSheet.create({
  map: {
    height: 300,
    borderRadius: 16,
    margin: 15,
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
});

type AppStackParamList = {
  Details: { poiDetails: POI };
};

type POIDetailsRouteProp = RouteProp<AppStackParamList>;

const ARPOIDetails = () => {
  const { params } = useRoute<POIDetailsRouteProp>();

  const poiQA = {
    label: 'dégradé',
    color: theme.colors.quality.yellow,
    labelColor: '#8D8500',
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      {params && params.poiDetails && (
        <>
          <View>
            <Card style={styles.map}>
              <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden' }}>
                <ARMap userLocationVisible interactionEnabled heatmapVisible>
                  <POIMarker {...params.poiDetails} />
                </ARMap>
              </View>
              <View style={styles.chipWrapper}>
                <ARQAChip size="md" shadowStyle={styles.shadow} item={poiQA} />
              </View>
            </Card>
          </View>
          <ARListItem
            poi={params.poiDetails}
            marginBottom={25}
            fontSizeDescription={16}
            fontSizeTitle={18}
          />
          <ARForecasts forecastQA />
        </>
      )}
    </ScrollView>
  );
};

export default ARPOIDetails;
