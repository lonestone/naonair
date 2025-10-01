import cultureIcon from '@assets/culture-icon.svg';
import favoriteIcon from '@assets/favorite-icon.svg';
import historyIcon from '@assets/history-icon.svg';
import marketIcon from '@assets/market-icon.svg';
import parkIcon from '@assets/park-icon.svg';
import sportIcon from '@assets/sport-icon.svg';
import { Feature, FeatureCollection, Point, Position } from 'geojson';

import { buildGeoserverUrl, buildMapboxUrl } from '@utils/config';
import removeAccent from '@utils/remove-accent';
import { getFavorites } from './favorites';
import { getAllPlaces } from './myplaces';
import { QAType, QAValues } from './qa';

// eslint-disable-next-line no-shadow
export enum POICategory {
  ALL = 'all',
  FAVORITE = 'favorite',
  PARK = 'park',
  SPORT = 'sport',
  CULTURE = 'culture',
  MARKET = 'market',
  HISTORY = 'history',
}

export interface POI {
  id: number | string; // TODO: need to be complianted with POI from json file and api-adresse.data.gouv.fr
  poi_id?: number;
  category: POICategory;
  name: string;
  address: string;
  geolocation: Position;
  qa?: QAType;
  favorited?: boolean;
}

export interface MapboxFeature extends Feature<Point> {
  id: string;
  text_fr: string;
  text: string;
  place_name_fr: string;
}

export const poiIcons: {
  [key in POICategory]?: string | null;
} = {
  [POICategory.CULTURE]: cultureIcon,
  [POICategory.FAVORITE]: favoriteIcon,
  [POICategory.ALL]: null,
  [POICategory.MARKET]: marketIcon,
  [POICategory.PARK]: parkIcon,
  [POICategory.SPORT]: sportIcon,
  [POICategory.HISTORY]: historyIcon,
};

type POIFeatureProperties = {
  id: number;
  poi_id: number;
  type: 'Parc' | 'Sport' | 'Culture' | 'Marché' | 'favoris' | 'history';
  lieu: string;
  adresse: string;
  commentaire?: string;
  date_time_iso_utc: string;
  date_time_local: string;
  indice: number;
  no2_indice: number;
  pm10_indice: number;
  pm25_indice: number;
  o3_indice: number;
  so2_indice: number;
};

const fetchAll = async () => {
  const date = new Date();
  date.setMinutes(0, 0, 0);

  const URL = buildGeoserverUrl('ows', {
    SERVICE: 'WFS',
    VERSION: '1.0.0',
    REQUEST: 'GetFeature',
    typeName: 'aireel:poi_data',
    outputFormat: 'application/json',
    CQL_FILTER: {
      date_time_iso_utc: date.toISOString(),
    },
  });

  console.info({ URL });
  const response = await fetch(URL);
  const json = (await response.json()) as FeatureCollection<
    Point,
    POIFeatureProperties
  >;

  return json.features.map<POI>(({ properties, geometry }) => {
    const { type, id, adresse, lieu, indice, poi_id } = properties;

    const getCategory = (): POICategory => {
      switch (type) {
        case 'Parc':
          return POICategory.PARK;
        case 'Sport':
          return POICategory.SPORT;
        case 'Culture':
          return POICategory.CULTURE;
        case 'Marché':
          return POICategory.MARKET;
        case 'favoris':
          return POICategory.FAVORITE;
        case 'history':
          return POICategory.HISTORY;
        default:
          return POICategory.ALL;
      }
    };

    return {
      ...properties,
      id,
      poi_id,
      category: getCategory(),
      name: lieu,
      address: adresse,
      geolocation: geometry.coordinates,
      qa: QAValues[indice],
    };
  });
};

export const getAll = async (params?: {
  categories?: POICategory[];
  text?: string;
}) => {
  const {
    categories = [
      POICategory.CULTURE,
      POICategory.FAVORITE,
      POICategory.MARKET,
      POICategory.PARK,
      POICategory.SPORT,
      POICategory.ALL,
    ],
    text = '',
  } = params || {};

  const lowedText = removeAccent(text).toLowerCase();

  const favorites = await getFavorites();
  const result = await fetchAll();
  // Check if each POI has been added to favorites
  const POIs = result.map(poi => {
    return { ...poi, favorited: favorites.has(`poi-${poi.id}`) };
  });

  let results = POIs.filter(pois => {
    return (
      categories.includes(pois.category) &&
      (removeAccent((pois.address || '').toLowerCase()).includes(lowedText) ||
        removeAccent(pois.name.toLowerCase()).includes(lowedText))
    );
  });

  if (categories.includes(POICategory.FAVORITE)) {
    // Add places and favorited POI not allready present to results
    const myPlaces = await getAllPlaces();
    const myFavorites = POIs.filter(p => p.favorited && !results.includes(p));
    const addToResult = [...myPlaces, ...myFavorites];

    results.push(
      ...addToResult.filter(
        p =>
          removeAccent((p.address || '').toLowerCase()).includes(lowedText) ||
          removeAccent(p.name.toLowerCase()).includes(lowedText),
      ),
    );
  }
  return results;
};

export const getOne = async (poi_id: number): Promise<POI | null> => {
  const URL = buildGeoserverUrl('ows', {
    REQUEST: 'GetFeature',
    VERSION: '1.0.0',
    SERVICE: 'WFS',
    typeName: 'aireel:poi_data',
    outputFormat: 'application/json',
    CQL_FILTER: {
      poi_id,
    },
  });

  try {
    const response = await fetch(URL);
    const json = (await response.json()) as FeatureCollection<
      Point,
      POIFeatureProperties
    >;

    if (!json.features || json.features.length === 0) {
      return null;
    }

    const feature = json.features[0];
    const { properties, geometry } = feature;
    const { type, id, adresse, lieu, indice } = properties;

    const getCategory = (): POICategory => {
      switch (type) {
        case 'Parc':
          return POICategory.PARK;
        case 'Sport':
          return POICategory.SPORT;
        case 'Culture':
          return POICategory.CULTURE;
        case 'Marché':
          return POICategory.MARKET;
        case 'favoris':
          return POICategory.FAVORITE;
        case 'history':
          return POICategory.HISTORY;
        default:
          return POICategory.ALL;
      }
    };

    // Récupérer les favoris pour définir la propriété favorited
    const favorites = await getFavorites();
    const isFavorited = favorites.has(`poi-${id}`);

    return {
      ...properties,
      id,
      poi_id,
      category: getCategory(),
      name: lieu,
      address: adresse,
      geolocation: geometry.coordinates,
      qa: QAValues[indice],
      favorited: isFavorited, // ← Ajouter cette ligne
    };
  } catch (error) {
    console.error('Error fetching POI by ID:', error);
    return null;
  }
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

export const geocoding = async (query: string): Promise<POI[]> => {
  const queryUrl = encodeURIComponent(query);

  const URL = buildMapboxUrl(queryUrl);

  console.info({ URL });
  const response = await fetch(URL);

  const { features } = (await response.json()) as { features: MapboxFeature[] };
  return features.map<POI>(f => ({
    id: f.id,
    category: POICategory.ALL,
    name: f.text_fr,
    address: f.place_name_fr,
    geolocation: f.geometry.coordinates,
  }));
};
