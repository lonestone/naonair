import poiJson from '../poi.json';

export enum POICategory {
  PARK = 'parc',
  SPORT = 'sport',
  CULTURE = 'culture',
  MARKET = 'market',
  UNDEFINED = 'undefined',
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

export const getAll = () => {
  return POIs;
};

export const getOne = (id: number) => {
  return POIs[id];
};
