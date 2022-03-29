import { Feature, FeatureCollection, Point, Position } from 'geojson';
import cultureIcon from '../assets/culture-icon.svg';
import favoriteIcon from '../assets/favorite-icon.svg';
import marketIcon from '../assets/market-icon.svg';
import parkIcon from '../assets/park-icon.svg';
import sportIcon from '../assets/sport-icon.svg';
import { buildGeoserverUrl, buildMapboxUrl } from '../utils/config';
import removeAccent from '../utils/remove-accent';
import { getAllPlaces } from './myplaces';
import { QAType, QAValues } from './qa';

// eslint-disable-next-line no-shadow
export enum POICategory {
  UNDEFINED = 'undefined',
  FAVORITE = 'favorite',
  PARK = 'park',
  SPORT = 'sport',
  CULTURE = 'culture',
  MARKET = 'market',
}

export interface POI {
  id: number | string; // TODO: need to be complianted with POI from json file and api-adresse.data.gouv.fr
  poi_id?: number;
  category: POICategory;
  name: string;
  address: string;
  geolocation: Position;
  qa?: QAType;
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
  [POICategory.UNDEFINED]: null,
  [POICategory.MARKET]: marketIcon,
  [POICategory.PARK]: parkIcon,
  [POICategory.SPORT]: sportIcon,
};

type POIFeatureProperties = {
  id: number;
  poi_id: number;
  type: 'Parc' | 'Sport' | 'Culture' | 'Marché' | 'favoris';
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
        default:
          return POICategory.UNDEFINED;
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
      qa: QAValues[indice - 1],
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
      POICategory.UNDEFINED,
    ],
    text = '',
  } = params || {};

  const lowedText = removeAccent(text).toLowerCase();

  const POIs = await fetchAll();

  let results = POIs.filter(pois => {
    return (
      categories.includes(pois.category) &&
      (removeAccent((pois.address || '').toLowerCase()).includes(lowedText) ||
        removeAccent(pois.name.toLowerCase()).includes(lowedText))
    );
  });

  if (categories.includes(POICategory.FAVORITE)) {
    results.push(
      ...(await getAllPlaces()).filter(
        p =>
          removeAccent((p.address || '').toLowerCase()).includes(lowedText) ||
          removeAccent(p.name.toLowerCase()).includes(lowedText),
      ),
    );
  }
  return results;
};

export const getOne = async (poi_id: number) => {
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

  const response = await fetch(URL);
  const json = (await response.json()) as FeatureCollection<
    Point,
    POIFeatureProperties
  >;

  return json.features[0].properties;
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
    category: POICategory.UNDEFINED,
    name: f.text_fr,
    address: f.place_name_fr,
    geolocation: f.geometry.coordinates,
  }));
};
