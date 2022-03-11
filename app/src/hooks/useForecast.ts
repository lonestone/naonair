import { useLayoutEffect, useRef, useState } from 'react';
import { Forecast, forecast } from '../actions/qa';

export const useForecast = (id: number) => {
  const [indices, setIndices] = useState<Forecast[]>([]);
  const isLoading = useRef(false);
  const [error, setError] = useState<any | undefined>();

  useLayoutEffect(() => {
    if (isLoading.current) {
      return;
    }

    forecast(id)
      .then(i => {
        isLoading.current = false;
        setIndices(i);
      })
      .catch(e => {
        isLoading.current = false;
        setError(e);
      });
  }, [id]);

  return [indices, isLoading.current, error];
};
