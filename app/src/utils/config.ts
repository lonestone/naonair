import { GEOSERVER, MAPBOX } from '../config.json';

export const jsonToUrl = (object: object) => {
  return Object.entries(object)
    .map(([key, value]) => {
      if (typeof value === 'object' && value && !Array.isArray(value)) {
        return `${encodeURIComponent(key)}=${Object.keys(value)
          .filter(_key => value[_key] !== undefined)
          .map(_key => `${_key}=${encodeURIComponent(value[_key])}`)
          .join(',')}`;
      } else if (Array.isArray(value)) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          value.map(encodeURIComponent).join(','),
        )}`;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
};

export const buildMapboxUrl = (query: string) => {
  const paramsUrl = jsonToUrl(MAPBOX.params);

  const URL = `${MAPBOX.baseUrl}${query}.json?${paramsUrl}`;
  return URL;
};

export interface GeoServerParams {
  VERSION: '1.1.1' | '1.1.0' | '1.0.0';
  SERVICE: 'WFS' | 'WMS';
  REQUEST: 'GetFeatureInfo' | 'GetFeature';
  LAYERS?: 'aireel:aireel_indic_7m_atmo_deg';
  SRS?: 'EPSG:4326';
  outputFormat?: 'application/json';
  QUERY_LAYERS?: 'aireel:aireel_indic_7m_atmo_deg';
  INFO_FORMAT?: 'application/json';
  FEATURE_COUNT?: number;
  X?: number;
  Y?: number;
  WIDTH?: number;
  HEIGHT?: number;
  typeName?:
    | 'aireel:poi_data'
    | 'aireel:parcours'
    | 'aireel:parcours_poi_data'
    | 'aireel:parcours_data';
  BBOX?: [number, number, number, number];
  CQL_FILTER?: {
    poi_id?: string | number;
    date_time_iso_utc?: string;
    id_parcours?: string | number;
  };
}

export const buildGeoserverUrl = (
  type: 'ows' | 'wms',
  params: GeoServerParams,
) => {
  const paramsUrl = jsonToUrl(params);

  const URL = `${GEOSERVER.baseUrl}/${type}?${paramsUrl}`;

  if (__DEV__) {
    // console.debug(URL);
  }
  return URL;
};
