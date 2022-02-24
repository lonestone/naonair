import { Feature, FeatureCollection, Point, Position } from 'geojson';
import poiJson from '../assets/db/poi.json';

import { MAPBOX } from '../config.json';
import { buildMapboxUrl } from '../utils/config';

export enum POICategory {
  UNDEFINED = -1,
  FAVORITE = 0,
  PARK = 1,
  SPORT = 2,
  CULTURE = 4,
  MARKET = 8,
  MY_PLACES = 10,
}

export interface POI {
  id: number | string; // TODO: need to be complianted with POI from json file and api-adresse.data.gouv.fr
  category: POICategory;
  name: string;
  adress: string;
  geolocation: Position;
}

export interface MapboxFeature extends Feature {
  id: string;
  text_fr: string;
  text: string;
  geometry: Point;
}

const POIs = poiJson.map<POI>(({ id, nom, categorie, adresse, gps }) => {
  const [lat, lon] = gps.split(',').map(t => +t);

  const getCategory = (): POICategory => {
    switch (categorie) {
      case 'Parc':
        return POICategory.PARK;
      case 'Sport':
        return POICategory.SPORT;
      case 'Culture':
        return POICategory.CULTURE;
      case 'Marche':
        return POICategory.MARKET;
      case 'favoris':
        return POICategory.FAVORITE;
      case 'my_places':
        return POICategory.MY_PLACES;
    }
    return POICategory.UNDEFINED;
  };

  return {
    id,
    category: getCategory(),
    name: nom,
    adress: adresse,
    geolocation: [lon, lat],
  };
});

export const getAll = (categories: POICategory[]) => {
  return POIs.filter(pois => {
    return categories.includes(pois.category);
  });
};

export const getOne = (id: number) => {
  return POIs[id];
};

export const reverse = async ([lon, lat]: Position): Promise<
  MapboxFeature[]
> => {
  try {
    const locationUrl = `${encodeURIComponent(lon)},${encodeURIComponent(lat)}`;

    const URL = buildMapboxUrl(locationUrl);

    const response = await fetch(URL);
    const { features } = (await response.json()) as FeatureCollection;
    return features as MapboxFeature[];
  } catch (e) {
    console.warn(e);
  }

  return [];
};

export const geocoding = async (query: string): Promise<MapboxFeature[]> => {
  const queryUrl = encodeURIComponent(query);

  const URL = buildMapboxUrl(queryUrl);

  const response = await fetch(URL);

  const { features } = (await response.json()) as FeatureCollection;
  return features as MapboxFeature[];
};
