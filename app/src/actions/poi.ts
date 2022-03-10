import { Feature, FeatureCollection, Point, Position } from 'geojson';
import cultureIcon from '../assets/culture-icon.svg';
import poiJson from '../assets/db/poi.json';
import favoriteIcon from '../assets/favorite-icon.svg';
import marketIcon from '../assets/market-icon.svg';
import parkIcon from '../assets/park-icon.svg';
import sportIcon from '../assets/sport-icon.svg';
import { buildMapboxUrl } from '../utils/config';
import removeAccent from '../utils/remove-accent';
import { getAllPlaces } from './myplaces';

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
  category: POICategory;
  name: string;
  address: string;
  geolocation: Position;
}

export interface MapboxFeature extends Feature<Point> {
  id: string;
  text_fr: string;
  text: string;
  place_name_fr: string;
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
    }
    return POICategory.UNDEFINED;
  };

  return {
    id,
    category: getCategory(),
    name: nom,
    address: adresse,
    geolocation: [lon, lat],
  };
});

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

  let results = POIs.filter(pois => {
    return (
      (categories.includes(pois.category) &&
        removeAccent((pois.address || '').toLowerCase()).includes(lowedText)) ||
      removeAccent(pois.name.toLowerCase()).includes(lowedText)
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
