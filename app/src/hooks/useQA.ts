import { Position } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import { ARParcours } from '../actions/parcours';
import { getQAFromParcours, getQAFromPosition, QAType } from '../actions/qa';

export const useQA = (coord?: Position) => {
  const [qa, setQA] = useState<QAType | undefined>();

  useEffect(() => {
    getQAFromPosition(coord!).then(setQA);
  }, [setQA, coord]);

  return qa;
};

export const useQAParcours = (parcours?: ARParcours) => {
  const [qa, setQA] = useState<number>();

  useEffect(() => {
    getQAFromParcours().then(setQA);
  }, [setQA]);

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
      .then(q => setQAs([...QAs, q]))
      .finally(() => {
        isReady.current = true;
        setIndex(index + 1);
      });
  }, [index, coords, QAs, isReady]);

  return { count: index, QAs };
};
