import { BBox, LineString, Position } from 'geojson';
// import routesJson from '../parcours.json';

// export const getAll = () => {
//   return routesJson;
// };

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

const API_ENDPOINT =
  'https://graphhopper.com/api/1//route?type=json&locale=fr&key=78ef7e51-7067-4081-8eb5-2fb03c1b8c8d&points_encoded=false';

export const calculateRoute = async (
  start: Position,
  end: Position,
  profile: RouteProfile,
): Promise<ARRoute> => {
  // https://graphhopper.com/api/1//route?point=47.218637,-1.554136&point=47.473988,-0.551559&type=json&locale=fr&key=78ef7e51-7067-4081-8eb5-2fb03c1b8c8d&elevation=true&points_encoded=false&profile=bike
  const startUrl = `point=${encodeURIComponent(start[1])},${encodeURIComponent(
    start[0],
  )}`;
  const endUrl = `point=${encodeURIComponent(end[1])},${encodeURIComponent(
    end[0],
  )}`;

  const url = `${API_ENDPOINT}&${startUrl}&${endUrl}&profile=${profile}`;
  const response = await fetch(url);
  const json = await response.json();

  console.info(json.paths);
  return json;
};
