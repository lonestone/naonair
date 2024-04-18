import { PollenDTO } from '@aireal/dtos';
import { POLLEN_TOKEN } from '@env';
import { API } from '../config.json';

const { baseUrl, pollenURL } = API;

const POLLEN_URL = `${baseUrl}pollen`;

export const getPollen = async (): Promise<PollenDTO[]> => {
  // Get Pollen from original API, not our API, to get the client wanted order
  try {
    const response = await fetch(pollenURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${POLLEN_TOKEN}`,
      },
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(JSON.stringify(response));
    }
    const json = await response.json();
    if (json === undefined) {
      return [];
    }
    return json.species;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPollenStates = async (): Promise<Record<number, string>> => {
  const response = await fetch(`${POLLEN_URL}/states`);
  const json = await response.json();
  if (json === undefined) {
    return [];
  }

  return json;
};
