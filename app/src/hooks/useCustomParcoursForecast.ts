import { useLayoutEffect, useRef, useState } from 'react';
import { customParcoursForecasts, Forecast } from '../actions/qa';

export const useCustomParcoursForecast = (points: [number, number][]) => {
  const [indices, setIndices] = useState<Forecast[]>([]);
  const isLoading = useRef(false);
  const [error, setError] = useState<any | undefined>();

  useLayoutEffect(() => {
    if (isLoading.current) {
      return;
    }

    customParcoursForecasts(points)
      .then(i => {
        isLoading.current = false;
        setIndices(i);
      })
      .catch(e => {
        isLoading.current = false;
        setError(e);
      });
  }, [points]);

  return [indices, isLoading.current, error];
};
