import { BBox, LineString, Position } from 'geojson';
import { GRAPHHOPPER } from '../config.json';
import { jsonToUrl } from '../utils/config';

export enum ARSign {
  uTurn = -98,
  leftUTurn = -8,
  keepLeft = -7,
  leaveRoundAbout = -6,
  turnSharpLeft = -3,
  turnLeft = -2,
  turnSlightLeft = -1,
  continue = 0,
  turnSlightRight = 1,
  turnRight = 2,
  turnSharpRight = 3,
  finishInstructionBeforeLastPoint = 4,
  instructionBeforeAViaPoint = 5,
  instructionBeforeEnteringARoundAbout = 6,
  keepRight = 7,
  rightUTurn = 8,
}

export interface ARInstruction {
  text: string; // A description what the user has to do in order to follow the route. The language depends on the locale parameter.
  street_name: string; // The name of the street to turn onto in order to follow the route.
  distance: number; // The distance for this instruction, in meters.
  interval: number[]; // Two indices into points, referring to the beginning and the end of the segment of the route this instruction refers to.
  time: number; // The duration for this instruction, in milliseconds.
  sign: ARSign; // A number which specifies the sign to show:
  exit_number: number; // Only available for roundabout instructions (sign is 6). The count of exits at which the route leaves the roundabout.
  turn_angle: number; // Only available for roundabout instructions (sign is 6). The radian of the route within the roundabout 0 < r < 2*PI for clockwise and -2*PI < r < 0 for counterclockwise turns.
}

export interface ARPath {
  distance: number;
  time: number;
  bbox: BBox;
  points: LineString;
  instructions: ARInstruction[];
}

export interface ARRoute {
  paths: ARPath[];
}

export enum RouteProfile {
  Bike = 'bike',
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
