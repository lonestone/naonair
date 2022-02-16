import {AlertDTO} from '@aireal/dtos';

const ALERTS_URL = 'https://naonair-api-staging.onrender.com/alerts';

export const getLastOne = async (): Promise<AlertDTO | null> => {
  const response = await fetch(ALERTS_URL);
  const json = await response.json();
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
