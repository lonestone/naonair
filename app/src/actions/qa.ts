import { BBox, FeatureCollection, Point, Position } from 'geojson';
import { theme } from '../theme';
import { buildGeoserverUrl, jsonToUrl } from '../utils/config';
import { FORECASTS } from '../config.json';

export enum QATypes {
  GOOD = 0,
  MEDIUM = 1,
  DEGRADED = 2,
  BAD = 3,
  XBAD = 4,
  XXBAD = 5,
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
  const bboxUrl = `BBOX=${bbox.map(encodeURIComponent).join(',')}`;
  const URL = buildGeoserverUrl(bboxUrl);

  try {
    const json = await (
      await fetch(URL, {
        headers: {
          Accept: 'application/json',
        },
      })
    ).json();

    const { GRAY_INDEX } = json.features[0].properties;

    const index = Math.round(
      (GRAY_INDEX / 100) * Object.entries(QAValues).length,
    );

    return QAValues[index];
  } catch (e) {
    console.info({ e, URL });
  }

  return QAValues[QATypes.GOOD];
};

export const getQAFromPosition = async (coord: Position) => {
  const bboxSize: number = 0.01;
  const bbox: BBox = [
    coord[0] - bboxSize,
    coord[1] - bboxSize,
    coord[0] + bboxSize,
    coord[1] + bboxSize,
  ];

  return await getQAFromBBox(bbox);
};

export interface Forecast {
  hour: Date;
  value: QATypes;
}

export const forecast = async (id: number): Promise<Forecast[]> => {
  const queryUrl = `CQL_FILTER=poi_id=${encodeURIComponent(id)}`;
  const params = jsonToUrl(FORECASTS.params);
  const URL = `${FORECASTS.baseUrl}?${params}&${queryUrl}`;

  console.info({ URL });
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
      indice: number;
    }
  >;

  return json.features.map<Forecast>(({ properties }) => {
    let hour = new Date(properties.date_time_iso_utc);
    return {
      hour,
      value: properties.indice - 1,
    };
  });
};
