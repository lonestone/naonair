import { GEOSERVER, MAPBOX } from '../config.json';

export const jsonToUrl = (object: object) => {
  return Object.entries(object)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');
};

export const buildMapboxUrl = (query: string) => {
  const paramsUrl = jsonToUrl(MAPBOX.params);

  const URL = `${MAPBOX.baseUrl}${query}.json?${paramsUrl}`;
  return URL;
};

export const buildGeoserverUrl = (query: string) => {
  const paramsUrl = jsonToUrl(GEOSERVER.params);

  const URL = `${GEOSERVER.baseUrl}?${paramsUrl}&${query}`;
  return URL;
};
