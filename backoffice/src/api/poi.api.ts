import { AxiosResponse } from "axios";
import request from "../axios";
import { settings } from "../settings";

export interface POI {
  id: number;
  poi_id: number;
  name: string;
  address: string;
  category: string;
  geolocation: [number, number];
}

// GeoServer response types (same as mobile app)
interface POIFeatureProperties {
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
}

interface FeatureCollection {
  type: string;
  features: Array<{
    type: string;
    properties: POIFeatureProperties;
    geometry: {
      type: string;
      coordinates: [number, number];
    };
  }>;
}

// Helper to build GeoServer URL (simplified from mobile app)
const jsonToUrl = (object: any) => {
  return Object.entries(object)
    .map(([key, value]) => {
      if (typeof value === 'object' && value && !Array.isArray(value)) {
        return `${encodeURIComponent(key)}=${Object.keys(value)
          .filter((_key: string) => (value as any)[_key] !== undefined)
          .map((_key: string) => `${_key}=${encodeURIComponent((value as any)[_key])}`)
          .join(',')}`;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`;
    })
    .join('&');
};

// Fetch real POIs from GeoServer (same logic as mobile app)
export const getPOIs = async (): Promise<POI[]> => {
  const date = new Date();
  date.setMinutes(0, 0, 0);

  const params = {
    SERVICE: 'WFS',
    VERSION: '1.0.0',
    REQUEST: 'GetFeature',
    typeName: 'aireel:poi_data',
    outputFormat: 'application/json',
    CQL_FILTER: {
      date_time_iso_utc: date.toISOString(),
    },
  };

  const paramsUrl = jsonToUrl(params);
  const geoServerUrl = `https://api.naonair.org/geoserver/aireel/ows?${paramsUrl}`;

  try {
    console.log('Fetching POIs from GeoServer:', geoServerUrl);
    const response = await fetch(geoServerUrl);
    const json: FeatureCollection = await response.json();

    console.log('GeoServer response:', json);

    return json.features.map((feature) => {
      const { type, id, adresse, lieu, poi_id } = feature.properties;
      const { coordinates } = feature.geometry;

      // Map category from GeoServer type to display name
      const getCategory = (): string => {
        switch (type) {
          case 'Parc':
            return 'Parc';
          case 'Sport':
            return 'Sport';
          case 'Culture':
            return 'Culture';
          case 'Marché':
            return 'Marché';
          default:
            return 'Autre';
        }
      };

      return {
        id,
        poi_id,
        name: lieu,
        address: adresse,
        category: getCategory(),
        geolocation: coordinates,
      };
    });
  } catch (error) {
    console.error('Error fetching POIs from GeoServer:', error);
    // Fallback to test data if GeoServer fails
    return [
      {
        id: 1,
        poi_id: 123,
        name: "Parc de la Beaujoire (test - GeoServer error)",
        address: "Boulevard de la Beaujoire, 44300 Nantes",
        category: "Parc",
        geolocation: [-1.5208, 47.2561],
      },
    ];
  }
};

export const downloadQRCode = async (poiId: number, format: 'png' | 'svg' = 'png'): Promise<Blob> => {
  const res: AxiosResponse = await request.get(
    `${settings.apiUrl}/qrcodes/poi/${poiId}?format=${format}`,
    { responseType: 'blob' }
  );
  return res.data;
};