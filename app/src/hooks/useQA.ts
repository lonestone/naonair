import { Position } from 'geojson';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ARParcours } from '../actions/parcours';
import {
  getQAFromCustomParcours,
  getQAFromParcours,
  getQAFromPosition,
  QAType,
} from '../actions/qa';

export const useQA = (
  coord?: Position,
  value?: QAType,
): [QAType | undefined, boolean, any] => {
  const [qa, setQA] = useState<QAType | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<any | undefined>(null);

  useLayoutEffect(() => {
    if (isLoading || value) {
      return;
    }

    setIsLoading(true);
    getQAFromPosition(coord!)
      .then(results => {
        setIsLoading(false);
        setQA(results);
      })
      .catch(e => {
        setIsLoading(false);
        setError(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQA, coord]);

  return [qa || value, isLoading, error];
};

export const useQAParcours = (parcours: ARParcours) => {
  const [qa, setQA] = useState<number>();

  useLayoutEffect(() => {
    getQAFromParcours(
      parcours.properties.id || parcours.properties.id_parcours,
    ).then(setQA);
  }, [parcours.properties.id, parcours.properties.id_parcours, setQA]);

  return qa;
};

export const useQACustomParcours = (points: [number, number][]) => {
  const [qa, setQA] = useState<number>();

  useLayoutEffect(() => {
    getQAFromCustomParcours(points).then(setQA);
  }, [points, setQA]);

  return qa;
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
      .then(q => q && setQAs([...QAs, q]))
      .finally(() => {
        isReady.current = true;
        setIndex(index + 1);
      });
  }, [index, coords, QAs, isReady]);

  return { count: index, QAs };
};
