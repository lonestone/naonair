import * as Sentry from '@sentry/react-native';
import * as turf from '@turf/turf';
import { BBox } from 'geojson';
import { buildGeoserverUrl } from '../utils/config';

export interface ARParcours {
  geometry: turf.MultiLineString;
  bbox: BBox;
  properties: {
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
  };
}

// https://api.naonair.org/geoserver/aireel/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=aireel%3Aparcours_poi_data&outputFormat=application%2Fjson

export const getAll = async (filters: string[]): Promise<ARParcours[]> => {
  try {
    const URL = buildGeoserverUrl('wms', {
      SERVICE: 'WFS',
      VERSION: '1.0.0',
      REQUEST: 'GetFeature',
      typeName: 'aireel:parcours',
      outputFormat: 'application/json',
    });

    const response = await fetch(URL);

    const geojson = (await response.json()) as { features: ARParcours[] };
    const parcours = geojson.features
      .map<ARParcours>(({ geometry, properties }) => {
        const bbox = turf.bbox(turf.multiLineString(geometry.coordinates));

        return {
          geometry,
          bbox,
          properties: {
            ...properties,
          },
        } as ARParcours;
      })
      .filter(p => filters.some(f => !!p.properties[f]));

    return parcours;
  } catch (e) {
    if (__DEV__) {
      console.info(e);
    } else {
      Sentry.captureException(e);
    }
  }

  return [];
};
