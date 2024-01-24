import { PollenDTO } from '@aireal/dtos';
import { API } from '../config.json';

const POLLEN_URL = `${API.baseUrl}pollen`;

export const getPollen = async (): Promise<PollenDTO[]> => {
  const response = await fetch(POLLEN_URL);
  const json = await response.json();
  if (json === undefined) {
    return [];
  }

  return json;
};

export const getPollenStates = async (): Promise<Record<number, string>> => {
  const response = await fetch(`${POLLEN_URL}/states`);
  const json = await response.json();
  if (json === undefined) {
    return [];
  }

  return json;
};
