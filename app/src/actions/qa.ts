// https://data.airpl.org/geoserver/aireel/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&QUERY_LAYERS=aireel%3Aaireel_indic_7m_atmo_deg&LAYERS=aireel%3Aaireel_indic_7m_atmo_deg&BBOX=-1.555848,47.212598,-1.555648,47.212798&SRS=EPSG%3A4326&INFO_FORMAT=application%2Fjson&REQUEST=GetFeatureInfo&FEATURE_COUNT=50&X=50&Y=50&WIDTH=101&HEIGHT=101

import { BBox, Position } from 'geojson';
import { theme } from '../theme';

export enum QATypes {
  GOOD = 0,
  MEDIUM = 1,
  DEGRADED = 2,
  BAD = 3,
  XBAD = 4,
  XXBAD = 5,
}

export type QAType = {
  primary: string;
  accent: string;
  label: string;
};

const { primary, accent } = theme.colors.quality;

export const QAValues: { [key: number]: QAType } = {
  [QATypes.GOOD]: { primary: primary.cyan, accent: accent.cyan, label: 'bon' },
  [QATypes.MEDIUM]: {
    primary: primary.green,
    accent: accent.green,
    label: 'moyen',
  },
  [QATypes.DEGRADED]: {
    primary: primary.yellow,
    accent: accent.yellow,
    label: 'dégradé',
  },
  [QATypes.BAD]: {
    primary: primary.red,
    accent: accent.orange,
    label: 'mauvais',
  },
  [QATypes.XBAD]: {
    primary: primary.darkRed,
    accent: accent.red,
    label: 'très mauvais',
  },
  [QATypes.XXBAD]: {
    primary: primary.purple,
    accent: accent.purple,
    label: 'extrêm. mauvais',
  },
};

export const getQAFromBBox = async (bbox: BBox): Promise<QAType> => {
  // [0,2,5,6] => "0,2,5,6"
  const bboxUrl = `BBOX=${bbox.map(encodeURIComponent).join(',')}`;

  const URL = `https://data.airpl.org/geoserver/aireel/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&QUERY_LAYERS=aireel%3Aaireel_indic_7m_atmo_deg&LAYERS=aireel%3Aaireel_indic_7m_atmo_deg&${bboxUrl}&SRS=EPSG%3A4326&INFO_FORMAT=application/json&REQUEST=GetFeatureInfo&FEATURE_COUNT=50&X=50&Y=50&WIDTH=101&HEIGHT=101`;

  console.info(URL);
  const json = await (await fetch(URL)).json();

  const { GRAY_INDEX } = json.features[0].properties;

  const index = Math.round(
    (GRAY_INDEX / 100) * Object.entries(QAValues).length,
  );

  return QAValues[index];
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
