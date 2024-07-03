import { BBox, FeatureCollection, Point, Position } from 'geojson';
import { theme } from '@theme';
import { buildGeoserverUrl } from '@utils/config';
import logger from '@utils/logger';
import { API } from '../config.json';

export enum QATypes {
  GOOD = 1,
  MEDIUM = 2,
  DEGRADED = 3,
  BAD = 4,
  XBAD = 5,
  XXBAD = 6,
}

export type QAType = {
  main: string; // main color
  light: string; // light color
  label: string;
};

const { main, light } = theme.colors.quality;

export const QAValues: { [key: number]: QAType } = {
  [QATypes.GOOD]: { main: main.cyan, light: light.cyan, label: 'bon' },
  [QATypes.MEDIUM]: {
    main: main.green,
    light: light.green,
    label: 'moyen',
  },
  [QATypes.DEGRADED]: {
    main: main.yellow,
    light: light.yellow,
    label: 'dégradé',
  },
  [QATypes.BAD]: {
    main: main.red,
    light: light.orange,
    label: 'mauvais',
  },
  [QATypes.XBAD]: {
    main: main.darkRed,
    light: light.red,
    label: 'très mauvais',
  },
  [QATypes.XXBAD]: {
    main: main.purple,
    light: light.purple,
    label: 'extrêm. mauvais',
  },
};

export const getQAFromBBox = async (bbox: BBox): Promise<QAType> => {
  // [0,2,5,6] => "0,2,5,6"

  const URL = buildGeoserverUrl('wms', {
    SERVICE: 'WMS',
    VERSION: '1.1.1',
    QUERY_LAYERS: 'aireel:aireel_indic_7m_atmo_deg',
    LAYERS: 'aireel:aireel_indic_7m_atmo_deg',
    BBOX: [bbox[0], bbox[1], bbox[2], bbox[3]],
    SRS: 'EPSG:4326',
    INFO_FORMAT: 'application/json',
    REQUEST: 'GetFeatureInfo',
    FEATURE_COUNT: 50,
    X: 50,
    Y: 50,
    WIDTH: 101,
    HEIGHT: 101,
  });

  try {
    const json = await (
      await fetch(URL, {
        headers: {
          Accept: 'application/json',
        },
      })
    ).json();

    const { GRAY_INDEX } = json.features[0].properties;

    const index = Math.floor(
      (GRAY_INDEX / 90) * Object.entries(QAValues).length,
    );
    console.info({ GRAY_INDEX, index });

    return QAValues[index + 1];
  } catch (e) {
    logger.error(e, 'getQAFromBBox');
  }

  return QAValues[QATypes.GOOD];
};

export const getQAFromPosition = async (coord: Position) => {
  if (!coord || coord.length < 2) {
    return;
  }

  const bboxSize: number = 0.01;
  const bbox: BBox = [
    coord[0] - bboxSize,
    coord[1] - bboxSize,
    coord[0] + bboxSize,
    coord[1] + bboxSize,
  ];

  return await getQAFromBBox(bbox);
};

export const getQAFromParcours = async (id_parcours: number) => {
  const URL = buildGeoserverUrl('ows', {
    REQUEST: 'GetFeature',
    VERSION: '1.0.0',
    SERVICE: 'WFS',
    outputFormat: 'application/json',
    typeName: 'aireel:parcours_data',
    CQL_FILTER: {
      id_parcours,
    },
  });

  console.info({ URL });
  try {
    const json = (await (
      await fetch(URL, {
        headers: {
          Accept: 'application/json',
        },
      })
    ).json()) as FeatureCollection<Point, { mode: number }>;

    const { features } = json;

    // const mid = Math.floor(features.length / 2);
    // let value = features[mid].properties.indice;
    // if (features.length % 2 !== 0) {
    //   console.info(value);
    //   return value;
    // }

    // value += features[mid + 1].properties.indice;
    // console.info({ value });
    return features[0].properties.mode;
  } catch (e) {
    logger.error(e, 'getQAFromParcours');
  }
};

export const getQAFromCustomParcours = async (points: [number, number][]) => {
  const URL = `${API.baseUrl}routing/custom/quality`;

  console.info(URL);
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ points }),
  });
  const json = (await response.json()) as { value: number };

  return json.value;
};

export interface Forecast {
  hour: Date;
  value: QAType;
}

export const forecast = async (
  poi_id: number,
  typeName: 'aireel:poi_data' | 'aireel:parcours_data',
): Promise<Forecast[]> => {
  const URL = buildGeoserverUrl('ows', {
    outputFormat: 'application/json',
    SERVICE: 'WFS',
    VERSION: '1.1.1',
    REQUEST: 'GetFeature',
    typeName,
    CQL_FILTER: {
      poi_id: typeName === 'aireel:poi_data' ? poi_id : undefined,
      id_parcours: typeName === 'aireel:parcours_data' ? poi_id : undefined,
    },
  });

  console.log('URRRRRRRRRL', URL);

  try {
    console.info(URL);
    const response = await fetch(URL);

    const json = (await response.json()) as FeatureCollection<
      Point,
      {
        id: number;
        poi_id: number;
        type: string;
        lieu: string;
        adresse: string;
        commentaire: string | null;
        date_time_iso_utc: string;
        date_time_local: string;
        indice?: number;
        mode?: number;
      }
    >;

    return json.features
      .map<Forecast>(({ properties }) => {
        let hour = new Date(properties.date_time_iso_utc);
        return {
          hour,
          value: QAValues[properties.indice ?? properties.mode ?? 1],
        };
      })
      .slice(1, json.features.length);
  } catch (e) {
    logger.error(e, 'forecasts');
    throw 'Impossible de récupérer les prévisions';
  }
};

export const customParcoursForecasts = async (
  points: [number, number][]
): Promise<Forecast[]> => {
  const URL = `${API.baseUrl}routing/custom/forecast`;

  console.info(URL);
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ points }),
  });
  const json = (await response.json()) as {
    hour: string;
    value: number;
  }[];

  console.log(json);

  return json.map<Forecast>(({ hour, value }) => ({
    hour: new Date(hour),
    value: QAValues[value] ?? QAValues[1],
  }));
};
