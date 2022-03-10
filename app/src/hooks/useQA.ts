import { Position } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import { getQAFromPosition, QAType } from '../actions/qa';
import { useLoading } from './useLoading';

export const useQA = (coord?: Position) => {
  const { isLoading, results } = useLoading(
    () => getQAFromPosition(coord!),
    null,
  );

  return { isLoading, qa: results };
};

export const useQAs = (coords: Position[]) => {
  const [QAs, setQAs] = useState<QAType[]>([]);

  const [index, setIndex] = useState<number>(0);
  const isReady = useRef(true);

  useEffect(() => {
    if (index >= coords.length || !isReady.current) {
      return;
    }

    isReady.current = false;
    getQAFromPosition(coords[index])
      .then(q => setQAs([...QAs, q]))
      .finally(() => {
        isReady.current = true;
        setIndex(index + 1);
      });
  }, [index, coords, QAs, isReady]);

  return { count: index, QAs };
};
