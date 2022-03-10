import { useEffect, useState } from 'react';
import { Forecast, forecast } from '../actions/qa';

export const useForecast = (id: number) => {
  const [indices, setIndices] = useState<Forecast[]>([]);

  useEffect(() => {
    forecast(id).then(setIndices);
  }, [setIndices, id]);

  return indices;
};
