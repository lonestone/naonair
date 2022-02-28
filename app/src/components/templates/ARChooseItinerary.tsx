import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as turf from '@turf/turf';
import { BBox } from '@turf/turf';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Headline, List, Surface } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ARPath,
  ARRoute,
  calculateRoute,
  getDistanceLabel,
  getDurationLabel,
  RouteProfile,
} from '../../actions/routes';
import { theme } from '../../theme';
import { StackNavigationScreenProp, StackParamList } from '../../types/routes';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARRouteMapView from '../organisms/ARRouteMapView';

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
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  itemLeftContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue[100],
  },
  title: {
    color: theme.colors.blue[500],
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginHorizontal: 18,
    marginBottom: 20,
  },
  item: {
    padding: 16,
  },
  itemTitle: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.blue[500],
  },
  itemDescription: {
    color: theme.colors.blue[300],
    fontSize: 12,
    lineHeight: 16,
  },
  right: { justifyContent: 'center' },
  rightLabel: {
    color: theme.colors.blue[500],
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  letsGoButton: {
    flex: 0,
    alignSelf: 'flex-end',
    marginRight: 24,
  },
});

export const BackButton = () => {
  const navigation = useNavigation<StackNavigationScreenProp>();

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

const ItineraryItem = ({
  path,
  onPress,
  index,
}: {
  path: ARPath;
  index: number;
  onPress: (index: number) => void;
}) => {
  return (
    <List.Item
      left={() => (
        <View style={styles.itemLeftContainer}>
          <Icon name="navigation" size={15} color={theme.colors.blue[500]} />
        </View>
      )}
      right={() => (
        <View style={styles.right}>
          <Text style={styles.rightLabel}>{getDurationLabel(path.time)}</Text>
        </View>
      )}
      style={styles.item}
      titleStyle={styles.itemTitle}
      descriptionStyle={styles.itemDescription}
      title="Le plus sain"
      description={getDistanceLabel(path.distance)}
      onPress={() => {
        onPress(index);
      }}
    />
  );
};

const ItineraryList = ({ paths = [] }: { paths: ARPath[] }) => {
  const [pathIndex, setPathIndex] = useState<number>(0);
  const navigation = useNavigation<StackNavigationScreenProp>();

  return (
    <Surface style={styles.listContainer}>
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <Headline style={styles.title}>Choisissez votre itinéraire</Headline>
        {paths.map((path, index) => (
          <ItineraryItem
            key={`path-${index}`}
            path={path}
            index={index}
            onPress={setPathIndex}
          />
        ))}
        <ARButton
          label="C'est parti"
          size={ARButtonSize.Medium}
          onPress={() =>
            navigation.navigate('Navigation', { path: paths[pathIndex] })
          }
          styleContainer={styles.letsGoButton}
          icon={() => (
            <Icon
              name="navigation-variant"
              size={36}
              color={theme.colors.white}
            />
          )}
        />
      </SafeAreaView>
    </Surface>
  );
};

const LoadingView = () => (
  <Surface style={styles.listContainer}>
    <Headline style={styles.title}>Calcul de l'itinéraire en cours...</Headline>
    <ActivityIndicator animating />
  </Surface>
);

export default () => {
  const { params } = useRoute<ARChooseItineraryProp>();
  const [route, setRoute] = useState<ARRoute | undefined>();
  const [bbox, setBbox] = useState<BBox | undefined>();

  const { start, end } = params;

  useEffect(() => {
    if (start && end) {
      const bbox = turf.bbox(
        turf.featureCollection([turf.point(start), turf.point(end)]),
      );
      setBbox(bbox);
    }
  }, [setBbox, start, end]);

  const getRoute = useCallback(async () => {
    if (start && end) {
      const routes = await calculateRoute(start, end, RouteProfile.Bike);

      setRoute(routes);
    }
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
