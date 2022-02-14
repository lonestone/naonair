import poiJson from '../poi.json';

export interface POI {
  id: number;
  category: string;
  name: string;
  adress: string;
  geolocation: {lat: number; lon: number};
}

const POIs = poiJson.map<POI>(({id, nom, categorie, adresse, gps}) => {
  const [lat, lon] = gps.split(',').map(t => +t);

  return {
    id: id,
    category: categorie,
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
