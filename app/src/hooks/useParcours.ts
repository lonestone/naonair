import { useLayoutEffect, useRef, useState } from 'react';
import { ARParcours, getAll } from '../actions/parcours';

export const useParcours = (
  filters: string[],
): [ARParcours[], boolean, string | undefined] => {
  const [parcours, setParcours] = useState<ARParcours[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const fetchingParcours = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (isLoading) {
      return;
    }

    if (fetchingParcours.current) {
      clearTimeout(fetchingParcours.current);
    }

    fetchingParcours.current = setTimeout(() => {
      getAll(filters)
        .then(p => {
          setParcours(p);
          setIsLoading(false);
        })
        .catch(e => {
          setError(e);
          setIsLoading(false);
        });
    }, 200) as unknown as number;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setParcours, filters]);

  return [parcours, isLoading, error];
};
