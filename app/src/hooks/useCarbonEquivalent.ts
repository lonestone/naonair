import { useEffect, useState } from 'react';
import { getCO2Equivalent } from '../actions/carbonEquivalent';

export const useCarbonEquivalent = (distance: number) => {
  const [carbonEquivalent, setCarbonEquivalent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any | undefined>();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    getCO2Equivalent(distance)
      .then(i => {
        setIsLoading(true);
        setCarbonEquivalent(i);
      })
      .catch(e => {
        setIsLoading(true);
        setError(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance]);

  return { carbonEquivalent, isLoading, error };
};
