import { AlertDTO } from '@aireal/dtos';
import { API } from '../config.json';

const ALERTS_URL = `${API.baseUrl}alerts`;

export const getLastOne = async (): Promise<AlertDTO | null> => {
  const response = await fetch(ALERTS_URL);
  const json = await response.json();
  if (json.length === 0) {
    return null;
  }

  const first: AlertDTO = {
    ...json[0],
    startDate: new Date(json[0].startDate),
    endDate: new Date(json[0].endDate),
  };

  const now = new Date();

  if (first.startDate <= now && first.endDate >= now) {
    return first;
  }

  return null;
};
