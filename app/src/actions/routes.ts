import { BBox, LineString, Position } from 'geojson';
import { GRAPHHOPPER } from '../config.json';
import { jsonToUrl } from '../utils/config';

export interface ARPath {
  distance: number;
  time: number;
  bbox: BBox;
  points: LineString;
}

export interface ARRoute {
  paths: ARPath[];
}

export enum RouteProfile {
  Bike = 'bike',
}

// value in meters
export const getDistanceLabel = (value: number): string => {
  if (value < 1000) {
    return `${Math.round(value * 10) / 10} M`;
  }

  return `${Math.round(value / 100) / 10} Km`;
};

// duration in milliseconds
export const getDurationLabel = (duration: number): string => {
  const portions: string[] = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + 'h');
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + 'm');
    duration = duration - minutes * msInMinute;
  }

  const seconds = Math.trunc(duration / 1000);
  if (seconds > 0) {
    portions.push(seconds + 's');
  }

  return portions.join(' ');
};

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
