import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as turf from '@turf/turf';
import { BBox } from '@turf/turf';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Headline, List, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ARPath,
  ARRoute,
  calculateRoute,
  RouteProfile,
} from '../../actions/routes';
import { theme } from '../../theme';
import { NavigationScreenProp, StackParamList } from '../../types/routes';

import ARRouteMapView from '../molecules/ARRouteMapView';

type ARChooseItineraryProp = RouteProp<StackParamList, 'ChooseItinerary'>;

const styles = StyleSheet.create({
  backButtonSafeArea: { position: 'absolute', paddingLeft: 16 },
  backButtonContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 14,
  },
  mapContainer: {
    flex: 2,
  },
  listContainer: {
    flex: 1,
  },
  itemLeftContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue[100],
  },
});

const BackButton = () => {
  const navigation = useNavigation<NavigationScreenProp>();

  return (
    <SafeAreaView style={styles.backButtonSafeArea}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Surface style={styles.backButtonContainer}>
          <Icon name="arrow-left" size={16} color={theme.colors.blue[500]} />
        </Surface>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const ItineraryItem = ({}: { path: ARPath }) => {
  return (
    <List.Item
      left={() => (
        <View style={styles.itemLeftContainer}>
          <Icon name="navigation" size={15} color={theme.colors.blue[500]} />
        </View>
      )}
      title="le plus sain"
      onPress={() => {
        // console.info(path);
      }}
    />
  );
};

const ItineraryList = ({ paths = [] }: { paths: ARPath[] }) => {
  return (
    <Surface style={styles.listContainer}>
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <Headline>Choisissez votre itinéraire</Headline>
        {paths.map((path, index) => (
          <ItineraryItem key={`path-${index}`} path={path} />
        ))}
      </SafeAreaView>
    </Surface>
  );
};

const LoadingView = () => (
  <Surface style={styles.listContainer}>
    <Headline>Calcul de l'itinéraire en cours...</Headline>
    <ActivityIndicator animating />
  </Surface>
);

export default () => {
  const { params } = useRoute<ARChooseItineraryProp>();
  const [route, setRoute] = useState<ARRoute | undefined>();
  const [bbox, setBbox] = useState<BBox | undefined>();

  const { start, end } = params;

  useEffect(() => {
    const bbox = turf.bbox(
      turf.featureCollection([turf.point(start), turf.point(end)]),
    );
    setBbox(bbox);
  }, [setBbox, start, end]);

  const getRoute = useCallback(async () => {
    const routes = await calculateRoute(start, end, RouteProfile.Bike);

    setRoute(routes);
  }, [end, start]);

  useEffect(() => {
    getRoute();
  }, [getRoute]);

  return (
    <>
      <View style={styles.mapContainer}>
        {bbox && (
          <ARRouteMapView
            paths={route?.paths || []}
            bbox={bbox}
            start={start}
            end={end}
          />
        )}
      </View>
      {route?.paths ? <ItineraryList paths={route?.paths} /> : <LoadingView />}
      <BackButton />
    </>
  );
};
