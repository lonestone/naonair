import { useEffect, useRef, useState } from 'react';
import {
  ARParcours,
  getAll,
  Parcours,
  ParcoursCategory,
} from '../actions/parcours';
import slugify from 'slugify';
import { useCustomParcours } from './useCustomParcours';

export const useParcours = function (filters?: ParcoursCategory[]) {
  const [arParcours, setArParcours] = useState<Parcours[]>([]);
  const [parcours, setParcours] = useState<ARParcours[]>([]);
  const { parcours: customParcours, refreshCustomParcoursList } =
    useCustomParcours();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const fetchingParcours = useRef<number | null>(null);

  const handleParcoursResponse = async (p: ARParcours[]) => {
    const retrievedParcours = p.map(
      p =>
      ({
        ...p,
        imageUri: `snapshot_${slugify(p.properties.nom, {
          lower: true,
          replacement: '_',
          remove: /[*+~.()'"!:@-]/g,
        })}`,
      } as Parcours),
    );

    setArParcours(retrievedParcours);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setParcours, filters]);

  const refreshList = async () => {
    if (isLoading || !filters) {
      return;
    }

    await refreshCustomParcoursList();

    if (fetchingParcours.current) {
      clearTimeout(fetchingParcours.current);
    }

    fetchingParcours.current = setTimeout(() => {
      setIsLoading(true);
      getAll(filters)
        .then(p => {
          handleParcoursResponse(p);
        })
        .catch(e => {
          setError(e);
          setIsLoading(false);
        });
    }, 200) as unknown as number;
  };

  useEffect(() => {
    if (
      filters?.includes(ParcoursCategory.CUSTOM) &&
      customParcours.length > 0
    ) {
      setParcours([...customParcours, ...arParcours]);
    } else {
      setParcours(arParcours);
    }
  }, [customParcours, arParcours, filters]);

  return { parcours, isLoading, error, refreshList };
};
