import { useLayoutEffect, useState } from 'react';
import { ARParcours, getAll } from '../actions/parcours';

export const useParcours = (
  filters: string[],
): [ARParcours[], boolean, string | undefined] => {
  const [parcours, setParcours] = useState<ARParcours[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  useLayoutEffect(() => {
    if (isLoading) {
      return;
    }

    getAll(filters)
      .then(p => {
        setParcours(p);
        setIsLoading(false);
      })
      .catch(e => {
        setError(e);
        setIsLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setParcours, filters]);

  return [parcours, isLoading, error];
};
