import { useLayoutEffect, useRef, useState } from 'react';
import { Forecast, forecast } from '../actions/qa';

export const useForecast = (
  id: number,
  typeName: 'aireel:poi_data' | 'aireel:parcours_data',
) => {
  const [indices, setIndices] = useState<Forecast[]>([]);
  const isLoading = useRef(false);
  const [error, setError] = useState<any | undefined>();

  useLayoutEffect(() => {
    if (isLoading.current) {
      return;
    }

    forecast(id, typeName)
      .then(i => {
        isLoading.current = false;
        setIndices(i);
      })
      .catch(e => {
        isLoading.current = false;
        setError(e);
      });
  }, [id, typeName]);

  return [indices, isLoading.current, error];
};
