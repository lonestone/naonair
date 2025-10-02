import { PollenDTO } from '@aireal/dtos';
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
        Authorization: `Token ${'00122206227a3369291ed94df4217c3cd01e7308'}`,
      },
    });
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
