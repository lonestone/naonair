// https://data.airpl.org/geoserver/aireel/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&QUERY_LAYERS=aireel%3Aaireel_indic_7m_atmo_deg&LAYERS=aireel%3Aaireel_indic_7m_atmo_deg&BBOX=-1.555848,47.212598,-1.555648,47.212798&SRS=EPSG%3A4326&INFO_FORMAT=application%2Fjson&REQUEST=GetFeatureInfo&FEATURE_COUNT=50&X=50&Y=50&WIDTH=101&HEIGHT=101

import { BBox, Position } from 'geojson';

export const getQAFromBBox = async (bbox: BBox) => {
  // [0,2,5,6] => "0,2,5,6"
  const bboxUrl = `BBOX=${bbox.map(encodeURIComponent).join(',')}`;

  const URL = `https://data.airpl.org/geoserver/aireel/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&QUERY_LAYERS=aireel%3Aaireel_indic_7m_atmo_deg&LAYERS=aireel%3Aaireel_indic_7m_atmo_deg&${bboxUrl}&SRS=EPSG%3A4326&INFO_FORMAT=application/json&REQUEST=GetFeatureInfo&FEATURE_COUNT=50&X=50&Y=50&WIDTH=101&HEIGHT=101`;

  console.info(URL);
  const json = await (await fetch(URL)).json();

  console.info(json);
};

export const getQAFromPosition = async (coord: Position) => {
  const bboxSize: number = 0.01;
  const bbox: BBox = [
    coord[1] - bboxSize,
    coord[0] - bboxSize,
    coord[1] + bboxSize,
    coord[0] + bboxSize,
  ];

  return await getQAFromBBox(bbox);
};
