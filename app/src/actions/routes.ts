import { BBox, LineString, Position } from 'geojson';
import { API } from '../config.json';
import { jsonToUrl } from '../utils/config';
import { ARInstruction } from './instructions';

export interface ARPath {
  distance: number;
  time: number;
  bbox: BBox;
  points: LineString;
  instructions: ARInstruction[];
}

export interface ARRoute {
  fastest_path: ARPath;
  cleanest_path: ARPath;
}

export enum RouteProfile {
  Bike = 'bike',
  ElecBike = 'scooter', // used by graphhopper
  Walk = 'foot', // used by graphhopper
}

export const getInstructionFromPathSection = (
  pathSectionIndex: number,
  currentInstructionIndex: number,
  instructions: ARInstruction[],
): number => {
  for (let i = currentInstructionIndex; i < instructions.length; i++) {
    if (i < 0) continue;

    const { interval } = instructions[i];
    if (interval[0] <= pathSectionIndex && interval[1] >= pathSectionIndex) {
      return i + 1;
    }
  }
  return currentInstructionIndex;
};

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
  const URL = `${API.baseUrl}routing?${jsonToUrl({
    startPoint: [start[1], start[0]],
    endPoint: [end[1], end[0]],
    profile,
  })}`;

  console.info(URL);

  // const url = `${GRAPHHOPPER.baseUrl}/route?${jsonToUrl(
  //   GRAPHHOPPER.params,
  // )}&${startUrl}&${endUrl}&profile=${profile}`;

  // console.info({ url });
  const response = await fetch(URL);
  const json = (await response.json()) as ARRoute;

  return json;
};
