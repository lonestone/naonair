import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as turf from '@turf/turf';
import { BBox } from '@turf/turf';
import { Position } from 'geojson';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  ActivityIndicator,
  Headline,
  List,
  Surface,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ARPath,
  ARRoute,
  calculateRoute,
  getDistanceLabel,
  getDurationLabel,
} from '../../actions/routes';
import { fonts, theme } from '@theme';
import { StackNavigationScreenProp, StackParamList } from '@type/routes';
import { ARButton, ARButtonSize } from '../atoms/ARButton';
import ARRouteMapView from '../organisms/ARRouteMapView';
import analytics from '@react-native-firebase/analytics';
import ARFloatingBackButton from '@molecules/ARFloatingBackButton';

type ARChooseItineraryProp = RouteProp<StackParamList, 'ChooseItinerary'>;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 0,
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
    ...fonts.Raleway.bold,
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
    ...fonts.Lato.medium,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.blue[500],
  },
  itemDescription: {
    ...fonts.Lato.medium,
    color: theme.colors.blue[300],
    fontSize: 12,
    lineHeight: 16,
  },
  right: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightLabel: {
    ...fonts.Lato.bold,
    color: theme.colors.blue[500],
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  letsGoButton: {
    flex: 0,
    alignSelf: 'flex-end',
    marginRight: 24,
    marginTop: 20,
  },
  chipQa: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 20,
  },
});

export type ARRouteType = 'fastest_path' | 'cleanest_path';

const ItineraryItem = ({
  isSelected,
  path,
  onPress,
  keyPath,
  label,
}: {
  isSelected?: boolean;
  path: ARPath;
  label: string;
  keyPath: ARRouteType;
  onPress: (key: ARRouteType) => void;
}) => {
  return (
    <List.Item
      left={() => (
        <View
          style={[
            styles.itemLeftContainer,
            !!isSelected ? { backgroundColor: theme.colors.white } : {},
          ]}>
          <Icon name="navigation" size={15} color={theme.colors.blue[500]} />
        </View>
      )}
      right={() => (
        <View style={styles.right}>
          <Text style={styles.rightLabel}>{getDurationLabel(path.time)}</Text>
        </View>
      )}
      style={[
        styles.item,
        !!isSelected ? { backgroundColor: theme.colors.blue[100] } : {},
      ]}
      rippleColor={theme.colors.blue[100]}
      titleStyle={styles.itemTitle}
      descriptionStyle={styles.itemDescription}
      title={label}
      description={getDistanceLabel(path.distance)}
      onPress={() => onPress(keyPath)}
    />
  );
};

const ItineraryList = ({
  route,
  userRoute,
  selected,
  onSelected,
}: {
  route: ARRoute;
  userRoute: ARRoute;
  selected: ARRouteType;
  onSelected: (path: ARRouteType) => void;
}) => {
  const navigation = useNavigation<StackNavigationScreenProp>();

  const { fastest_path, cleanest_path } = route;

  return (
    <Surface style={styles.listContainer}>
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <Headline style={styles.title}>Choisissez votre itinéraire</Headline>
        {cleanest_path && (
          <ItineraryItem
            label={
              fastest_path ? 'Le plus sain' : 'Le plus sain et le plus rapide'
            }
            path={cleanest_path}
            keyPath="cleanest_path"
            onPress={onSelected}
            key="cleanest_path"
            isSelected={selected === 'cleanest_path'}
          />
        )}
        {fastest_path && (
          <ItineraryItem
            label="Le plus rapide"
            path={fastest_path}
            keyPath="fastest_path"
            key="fastest_path"
            isSelected={selected === 'fastest_path'}
            onPress={onSelected}
          />
        )}

        <ARButton
          label="C'est parti !"
          size={ARButtonSize.Medium}
          onPress={async () => {
            await analytics().logEvent('demarrage_navigation', {
              selected,
            });

            navigation.navigate('Navigation', { path: userRoute[selected] });
          }}
          styleContainer={styles.letsGoButton}
          icon={() => (
            <Icon
              name="navigation-variant"
              size={25}
              color={theme.colors.white}
            />
          )}
        />
      </SafeAreaView>
    </Surface>
  );
};

const LoadingView = () => (
  <Surface style={[styles.listContainer]}>
    <SafeAreaView edges={['bottom']}>
      <Headline style={styles.title}>
        Calcul de l'itinéraire en cours...
      </Headline>
      <ActivityIndicator animating />
    </SafeAreaView>
  </Surface>
);

export default () => {
  const { params } = useRoute<ARChooseItineraryProp>();
  const [userRoute, setUserRoute] = useState<ARRoute | undefined>();
  const [route, setRoute] = useState<ARRoute | undefined>();
  const [bbox, setBbox] = useState<BBox | undefined>();
  const [selected, setSelected] = useState<ARRouteType>('cleanest_path');

  const { start, end, transportMode } = params;

  const getUserPosition = useCallback(async (): Promise<Position> => {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        async ({ coords: { longitude, latitude } }) => {
          console.info('getCurrentPosition', longitude, latitude);
          resolve([longitude, latitude]);
        },
      );
    });
  }, []);

  useEffect(() => {
    if (start && end) {
      const bbox = turf.bbox(
        turf.featureCollection([turf.point(start), turf.point(end)]),
      );
      setBbox(bbox);
    }
  }, [setBbox, start, end]);

  const getRoute = useCallback(async () => {
    const userPosition = await getUserPosition();
    console.info({ userPosition });

    if (start && end) {
      const routes = await calculateRoute(start, end, transportMode);
      setRoute(routes);

      const userRoutes = await calculateRoute(userPosition, end, transportMode);
      setUserRoute(userRoutes);

      setTimeout(() => {
        setBbox(routes.cleanest_path.bbox);
      });
    }
  }, [end, start, transportMode]);

  useEffect(() => {
    getRoute();
  }, [getRoute]);

  return (
    <>
      <View style={styles.mapContainer}>
        {bbox && (
          <ARRouteMapView
            route={route}
            bbox={bbox}
            start={start}
            end={end}
            selected={selected}
          />
        )}
      </View>
      {route && userRoute ? (
        <ItineraryList
          selected={selected}
          route={route}
          userRoute={userRoute}
          onSelected={key => {
            setSelected(key);
          }}
        />
      ) : (
        <LoadingView />
      )}
      <ARFloatingBackButton />
    </>
  );
};
