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
          <View>
            <ARQAChip
              item={{
                label: 'dégradé',
                color: theme.colors.quality.yellow,
                labelColor: '#8D8500',
              }}
            />
          </View>
          <ARListItem
            poi={params.poiDetails}
            marginBottom={25}
            fontSizeDescription={16}
            fontSizeTitle={18}
          />
          <ARForecasts poi={params.poiDetails} forecastQA />
        </>
      )}
    </ScrollView>
  );
};

export default ARPOIDetails;
