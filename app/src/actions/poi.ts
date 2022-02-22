import { Feature, FeatureCollection, Point, Position } from 'geojson';
import poiJson from '../poi.json';

export enum POICategory {
  UNDEFINED = -1,
  FAVORITE = 0,
  PARK = 1,
  SPORT = 2,
  CULTURE = 4,
  MARKET = 8,
}

export interface POI {
  id: number | string; // TODO: need to be complianted with POI from json file and api-adresse.data.gouv.fr
  category: POICategory;
  name: string;
  adress: string;
  geolocation: { lat: number; lon: number };
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
      case 'parc':
        return POICategory.PARK;
      case 'sport':
        return POICategory.SPORT;
      case 'culture':
        return POICategory.CULTURE;
      case 'marche':
        return POICategory.MARKET;
    }
    return POICategory.UNDEFINED;
  };

  return {
    id,
    category: getCategory(),
    name: nom,
    adress: adresse,
    geolocation: {
      lat,
      lon,
    },
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
    const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      lon,
    )},${encodeURIComponent(
      lat,
    )}.json?country=fr&bbox=-1.7%2C47.1%2C-1.4%2C47.3&types=poi%2Cplace%2Cpostcode%2Caddress&language=fr&autocomplete=true&access_token=${MAPBOX_API_TOKEN}`;
    console.info(URL);
    const response = await fetch(URL);
    const { features } = (await response.json()) as FeatureCollection;
    return features as MapboxFeature[];
  } catch (e) {
    console.warn(e);
  }

  return [];
};

const MAPBOX_API_TOKEN =
  'pk.eyJ1Ijoiam9obHMiLCJhIjoiY2t5anlxMDh6MDhydjJ3cG5tb2ZyN3NpMiJ9.NnDn9gsdYR8c0MpGxlpqkA';

export const geocoding = async (query: string): Promise<MapboxFeature[]> => {
  const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?country=fr&bbox=-1.7%2C47.1%2C-1.4%2C47.3&limit=8&types=poi%2Cplace%2Cpostcode%2Caddress&language=fr&autocomplete=true&access_token=${MAPBOX_API_TOKEN}`;
  const response = await fetch(URL);

  const { features } = (await response.json()) as FeatureCollection;
  return features as MapboxFeature[];
};
