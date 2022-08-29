import { useEffect, useRef, useState } from 'react';
import { ARParcours, getAll, ParcoursCategory } from '../actions/parcours';

export const useParcours = function (filters: ParcoursCategory[]) {
  const [parcours, setParcours] = useState<ARParcours[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const fetchingParcours = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (fetchingParcours.current) {
      clearTimeout(fetchingParcours.current);
    }

    fetchingParcours.current = setTimeout(() => {
      setIsLoading(true);
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

  return { parcours, isLoading, error };
};
