import { useEffect, useMemo, useRef, useState } from 'react';
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
  const {
    parcours: customParcours,
    refreshCustomParcoursList,
    loading: customParcoursLoading,
  } = useCustomParcours();
  const [arParcoursLoading, setArParcoursLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const fetchingParcours = useRef<number | null>(null);
  const isLoading = useMemo(
    () => arParcoursLoading || customParcoursLoading,
    [arParcoursLoading, customParcoursLoading],
  );

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
    setArParcoursLoading(false);
  };

  useEffect(() => {
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setParcours, filters]);

  const refreshList = async () => {
    if (arParcoursLoading || !filters) {
      return;
    }

    await refreshCustomParcoursList();

    if (fetchingParcours.current) {
      clearTimeout(fetchingParcours.current);
    }

    fetchingParcours.current = setTimeout(() => {
      setArParcoursLoading(true);
      getAll(filters)
        .then(p => {
          handleParcoursResponse(p);
        })
        .catch(e => {
          setError(e);
          setArParcoursLoading(false);
        });
    }, 200) as unknown as number;
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (
      filters?.includes(ParcoursCategory.CUSTOM) &&
      customParcours.length > 0
    ) {
      setParcours([...customParcours, ...arParcours]);
    } else {
      setParcours(arParcours);
    }
  }, [customParcours, arParcours, filters, isLoading]);

  return { parcours, isLoading, error, refreshList };
};
