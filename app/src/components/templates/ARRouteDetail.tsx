import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QATypes, QAValues } from '../../actions/qa';
import { fonts, theme } from '../../theme';
import { StackParamList } from '../../types/routes';
import ARMap from '../atoms/ARMap';
import ARPathLayer from '../atoms/ARPathLayer';
import ARQAChip from '../atoms/ARQAChip';
import ARForecasts from '../organisms/ARForecasts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  mapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: 362,
    alignSelf: 'stretch',
    flex: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapChip: {
    position: 'absolute',
    bottom: -15,
    marginVertical: 0,
  },
  headContainer: {
    flexDirection: 'row',
    marginTop: 26,
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  headline: {
    ...fonts.Raleway.bold,
    color: theme.colors.blue[500],
    fontSize: 20,
    lineHeight: 24,
  },
  denivele: {
    ...fonts.Lato.regular,
    fontSize: 14,
    lineHeight: 24,
    color: theme.colors.blue[300],
  },
  distance: {
    backgroundColor: theme.colors.blue[500],
    borderRadius: 4,
    padding: 10,
    overflow: 'hidden',
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceKm: {
    color: theme.colors.white,
    ...fonts.Raleway.bold,
    fontSize: 20,
    lineHeight: 20,
    // textAlignVertical: 'top',
  },
  distanceUnit: {
    ...fonts.Lato.regular,
    fontSize: 12,
    lineHeight: 20,
    color: theme.colors.white,
    marginLeft: 4,
    // textAlignVertical: 'center',
  },
  speedContainer: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 0,
    marginVertical: 4,
  },
  speedIcon: {},
  speedUnit: {
    marginLeft: 18,
    ...fonts.Raleway.bold,
    fontSize: 20,
    lineHeight: 24,
    color: theme.colors.blue[500],
    width: 50,
  },
  speedLabel: {
    ...fonts.Lato.regular,
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.blue[300],
    flex: 1,
  },
});

export type ARRouteDetailProp = RouteProp<StackParamList, 'RouteDetail'>;

export default ({}: ARRouteDetailProp) => {
  const { parcours, qa } = useRoute<ARRouteDetailProp>().params || {};

  console.info({ parcours });

  const {
    coureur,
    cycliste,
    marcheur,
    km,
    marcheurs_temps_min,
    coureurs_temps_min,
    cyclistes_temps_min,
  } = parcours.properties;
  console.info(parcours);

  const speeds = [
    marcheur && {
      icon: 'walk',
      speed: marcheurs_temps_min,
      label: 'minutes de marche',
    },
    coureur && {
      icon: 'run',
      speed: cyclistes_temps_min,
      label: 'minutes de course',
    },
    cycliste && {
      icon: 'bike',
      speed: coureurs_temps_min,
      label: 'minutes à vélo',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
        <View style={styles.mapContainer}>
          <ARMap
            heatmapVisible
            userLocationVisible
            interactionEnabled
            bbox={parcours.bbox}
            style={styles.map}>
            <ARPathLayer path={parcours} />
          </ARMap>
          <ARQAChip
            style={styles.mapChip}
            size="md"
            value={QAValues[qa ?? QATypes.XXBAD]}
          />
        </View>

        <View style={styles.headContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headline}>{parcours.properties.nom}</Text>
            <Text style={styles.denivele}>
              Dénivelé : {parcours.properties.denivele}m
            </Text>
          </View>
          <View style={styles.distance}>
            <Text style={styles.distanceKm}>{Math.round(km * 10) / 10}</Text>
            <Text style={styles.distanceUnit}>Km</Text>
          </View>
        </View>

        {speeds.map(
          s =>
            s && (
              <View key={`speed-${s.icon}`} style={styles.speedContainer}>
                <Icon color={theme.colors.blue[500]} name={s.icon} size={24} />
                <Text style={styles.speedUnit}>{Math.round(s.speed)}</Text>
                <Text style={styles.speedLabel}>{s.label}</Text>
              </View>
            ),
        )}

        <ARForecasts id={parcours.properties.id} type="aireel:parcours_data" />
      </SafeAreaView>
    </ScrollView>
  );
};
