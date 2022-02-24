import { BBox, LineString, Position } from 'geojson';
import { GRAPHHOPPER } from '../config.json';
import { jsonToUrl } from '../utils/config';

export interface ARPath {
  distance: number;
  time: string;
  bbox: BBox;
  points: LineString;
}

export interface ARRoute {
  paths: ARPath[];
}

export enum RouteProfile {
  Bike = 'bike',
}

export const calculateRoute = async (
  start: Position,
  end: Position,
  profile: RouteProfile,
): Promise<ARRoute> => {
  const startUrl = `point=${encodeURIComponent(start[1])},${encodeURIComponent(
    start[0],
  )}`;

  const endUrl = `point=${encodeURIComponent(end[1])},${encodeURIComponent(
    end[0],
  )}`;

  const url = `${GRAPHHOPPER.baseUrl}/route?${jsonToUrl(
    GRAPHHOPPER.params,
  )}&${startUrl}&${endUrl}&profile=${profile}`;

  console.info({ url });
  const response = await fetch(url);
  const json = await response.json();

  return json;
};
