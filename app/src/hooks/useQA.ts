import { Position } from 'geojson';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getQAFromPosition, QAType } from '../actions/qa';
import { useMounted } from './useMounted';

export const useQA = (coord?: Position) => {
  const mounted = useMounted();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [qa, setQA] = useState<QAType | undefined>();

  const getQA = useCallback(async () => {
    if (!coord || !mounted.current) {
      return;
    }

    setIsLoading(true);

    try {
      const qa = await getQAFromPosition(coord!);

      if (mounted.current) {
        setQA(qa);
      }
    } catch (e) {
      console.info(e);
    }

    setIsLoading(false);
  }, [coord, mounted]);

  useEffect(() => {
    getQA();
  }, [getQA]);

  return { isLoading, qa };
};
