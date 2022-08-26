import * as Sentry from '@sentry/react-native';
import * as turf from '@turf/turf';
import { BBox } from 'geojson';
import { buildGeoserverUrl } from '../utils/config';
import { getFavorites } from './favorites';

export interface ARParcours {
  geometry: turf.MultiLineString;
  bbox: BBox;
  properties: {
    mode: number;
    id_parcours: number;
    id: number;
    date_maj: string;
    nom: string;
    km: number;
    denivele: number;
    cycliste: boolean;
    coureur: boolean;
    marcheur: boolean;
    marcheurs_temps_min: number;
    cyclistes_temps_min: number;
    coureurs_temps_min: number;
    favorited?: boolean;
  };
}

// eslint-disable-next-line no-shadow
export enum ParcoursCategory {
  ALL = 'all',
  FAVORITE = 'favorite',
  WALK = 'marcheur',
  BIKE = 'cycliste',
  RUNNING = 'coureur',
}

// https://api.naonair.org/geoserver/aireel/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=aireel%3Aparcours_poi_data&outputFormat=application%2Fjson

export const getAll = async (
  filters: ParcoursCategory[],
): Promise<ARParcours[]> => {
  try {
    const URL = buildGeoserverUrl('ows', {
      SERVICE: 'WFS',
      VERSION: '1.0.0',
      REQUEST: 'GetFeature',
      typeName: 'aireel:parcours',
      outputFormat: 'application/json',
    });

    console.info(URL);

    const response = await fetch(URL);
    const favorites = await getFavorites();

    const geojson = (await response.json()) as { features: ARParcours[] };
    const parcours = geojson.features.map<ARParcours>(
      ({ geometry, properties }) => {
        const bbox = turf.bbox(turf.multiLineString(geometry.coordinates));

        return {
          geometry,
          bbox,
          properties: {
            ...properties,
            // Check if each parcours has been added to favorites
            favorited: favorites.has(`${properties.id}`),
          },
        } as ARParcours;
      },
    );

    let result = parcours.filter(p => filters.some(f => !!p.properties[f]));

    // Add favorited parcours not allready present to results
    if (filters.includes(ParcoursCategory.FAVORITE)) {
      const favoritesToAdd = parcours.filter(
        p => p.properties.favorited && !result.includes(p),
      );
      result = [...result, ...favoritesToAdd];
    }

    return result;
  } catch (e) {
    if (__DEV__) {
      console.info(e);
    } else {
      Sentry.captureException(e);
    }
  }

  return [];
};
