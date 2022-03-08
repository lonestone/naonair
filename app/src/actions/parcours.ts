import * as turf from '@turf/turf';
import { BBox } from 'geojson';
import { PARCOURS } from '../config.json';
import { jsonToUrl } from '../utils/config';

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
  };
}

export const getAll = async (filters: string[]): Promise<ARParcours[]> => {
  const response = await fetch(
    `${PARCOURS.baseUrl}?${jsonToUrl(PARCOURS.params)}`,
  );

  const geojson = (await response.json()) as { features: ARParcours[] };
  return geojson.features
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
};
