import { API } from '../config.json';

const { impactCO2Url } = API;

const TRANSPORT_URL = `${impactCO2Url}/transport`;
const QUERY_PARAMS =
  '&displayAll=0&transports=4&ignoreRadiativeForcing=0&numberOfPassenger=1&includeConstruction=0';

type ResponseType = {
  data: {
    id: number;
    name: string;
    value: number;
  }[];
};

export const getCO2Equivalent = async (distance: number): Promise<number> => {
  const response = await fetch(
    `${TRANSPORT_URL}?km=${distance}${QUERY_PARAMS}`,
  );
  const json = (await response.json()) as ResponseType;

  if (json === undefined || json.data.length === 0) {
    return 0;
  }

  return json.data[0].value;
};
