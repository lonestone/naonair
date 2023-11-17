import { PollenDTO } from '@aireal/dtos';
import { API } from '../config.json';

const ALERTS_URL = `${API.baseUrl}pollen`;

export const getPollen = async (): Promise<PollenDTO | null> => {
  const response = await fetch(ALERTS_URL);
  const json = await response.json();
  console.log(JSON.stringify(json));
  if (json === undefined) {
    return null;
  }

  return json.species;
};
