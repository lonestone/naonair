import {FeatureCollection} from 'geojson';
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
  id: number;
  category: POICategory;
  name: string;
  adress: string;
  geolocation: {lat: number; lon: number};
}

const POIs = poiJson.map<POI>(({id, nom, categorie, adresse, gps}) => {
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

export const geocoding = async (query: string): Promise<FeatureCollection> => {
  const API_ENDPOINT = 'https://api-adresse.data.gouv.fr/search/?q=';
  const response = await fetch(`${API_ENDPOINT}${encodeURIComponent(query)}`);
  return await response.json();
};
