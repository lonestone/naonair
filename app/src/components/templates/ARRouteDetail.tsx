import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  addToFavorites,
  isFavorited,
  removeFromFavorites,
} from '../../actions/favorites';
import { ARParcours, CustomParcours } from '../../actions/parcours';
import { QAValues } from '../../actions/qa';
import { fonts, theme } from '@theme';
import { StackNavigationScreenProp, StackParamList } from '@type/routes';
import ARMap from '../atoms/ARMap';
import ARPathLayer from '../atoms/ARPathLayer';
import ARQAChip from '../atoms/ARQAChip';
import BackButton from '@molecules/ARBackButton';
import ARCommonHeader from '@molecules/ARCommonHeader';
import FavoriteButton from '@molecules/ARFavoriteButton';
import { useCustomParcours } from '@hooks/useCustomParcours';
import ARDeleteParcoursButton from '@molecules/ARDeleteParcoursButton';
import ARParcourRecordingDataItem from '@molecules/ARParcourRecordingDataItem';
import { formatTime } from '@utils/formatTime';
import ARCarbonEquivalent from '@molecules/ARCarbonEquivalent';
import ARGeoserverForecasts from '../organisms/ARGeoserverForecasts';
import ARCustomParcoursForecasts from '../organisms/ARCustomParcoursForecasts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  safeArea: {
    flex: 1,
    paddingBottom: 32,
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
  subTitle: {
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carbonEquivalent: {
    marginTop: 16,
  },
});

export type ARRouteDetailProp = RouteProp<StackParamList, 'RouteDetail'>;

export default ({}: ARRouteDetailProp) => {
  const { parcours, qa } = useRoute<ARRouteDetailProp>().params || {};
  const [favorited, setFavorited] = useState(parcours.properties.favorited);
  const { deleteParcours } = useCustomParcours();
  const navigation = useNavigation<StackNavigationScreenProp>();

  useEffect(() => {
    checkIsFavorited(parcours);
  }, [parcours]);

  const checkIsFavorited = async (item: ARParcours) => {
    const result = await isFavorited(item);
    setFavorited(result);
  };

  const {
    coureur,
    cycliste,
    marcheur,
    km,
    marcheurs_temps_min,
    coureurs_temps_min,
    cyclistes_temps_min,
  } = parcours.properties;

  const speeds = [
    marcheur && {
      icon: 'walk',
      speed: marcheurs_temps_min,
      label: 'minutes de marche',
    },
    coureur && {
      icon: 'run',
      speed: coureurs_temps_min,
      label: 'minutes de course',
    },
    cycliste && {
      icon: 'bike',
      speed: cyclistes_temps_min,
      label: 'minutes à vélo',
    },
  ];

  const toggleFavorited = async () => {
    setFavorited(value => !value);

    favorited
      ? await removeFromFavorites(parcours)
      : await addToFavorites(parcours);
  };

  const removeParcours = useCallback(
    async (p: CustomParcours) => {
      await deleteParcours(p.properties.id);
      navigation.replace('Home', { screen: 'Parcours' });
    },
    [deleteParcours, navigation],
  );

  const formatedDate = useMemo(() => {
    const d = new Date(parcours.properties.date_maj);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [parcours.properties.date_maj]);

  return (
    <>
      <ARCommonHeader
        headline="Détails"
        left={<BackButton />}
        right={
          <View style={styles.actionRow}>
            {parcours.type === 'Custom' && (
              <ARDeleteParcoursButton
                onDelete={() => removeParcours(parcours)}
              />
            )}
            {parcours.type !== 'Custom' && (
              <FavoriteButton
                isFavorited={favorited}
                onPress={toggleFavorited}
              />
            )}
          </View>
        }
      />
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView style={styles.container}>
        <SafeAreaView
          edges={['bottom', 'left', 'right']}
          style={styles.safeArea}>
          <View style={styles.mapContainer}>
            <ARMap
              heatmapVisible
              userLocationVisible
              interactionEnabled
              bbox={parcours.bbox}
              style={styles.map}>
              <ARPathLayer path={parcours} />
            </ARMap>
            {qa && (
              <ARQAChip style={styles.mapChip} size="md" value={QAValues[qa]} />
            )}
          </View>

          <View style={styles.headContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headline}>{parcours.properties.nom}</Text>
              {parcours.properties.denivele > 0 && (
                <Text style={styles.subTitle}>
                  Dénivelé : {parcours.properties.denivele}m
                </Text>
              )}
              {parcours.properties.date_maj && (
                <Text style={styles.subTitle}>
                  Date d'enregistrement : {formatedDate}
                </Text>
              )}
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
                  <Icon
                    color={theme.colors.blue[500]}
                    name={s.icon}
                    size={24}
                  />
                  <Text style={styles.speedUnit}>{Math.round(s.speed)}</Text>
                  <Text style={styles.speedLabel}>{s.label}</Text>
                </View>
              ),
          )}

          {parcours.type === 'Custom' && (
            <View style={styles.actionRow}>
              <ARParcourRecordingDataItem
                title="Temps"
                value={formatTime(parcours.properties.timeTaken ?? 0)}
                size="sm"
              />
              <ARParcourRecordingDataItem
                title="Distance"
                value={`${parcours.properties.km.toFixed(2)} km`}
                size="sm"
              />
              <ARParcourRecordingDataItem
                title="Vitesse moyenne"
                value={`${parcours.properties.avgSpeed?.toFixed(2)} km/h`}
                size="sm"
              />
            </View>
          )}

          {parcours.type === 'Custom' && (
            <View style={styles.carbonEquivalent}>
              <ARCarbonEquivalent distance={parcours.properties.km} />
            </View>
          )}

          {parcours.type === undefined && (
            <ARGeoserverForecasts
              id={parcours.properties.id}
              type="aireel:parcours_data"
            />
          )}
          {parcours.type === 'Custom' && (
            <ARCustomParcoursForecasts
              points={parcours.geometry.coordinates[0] as [number, number][]}
            />
          )}
        </SafeAreaView>
      </ScrollView>
    </>
  );
};
