import React from 'react';
import { useCustomParcoursForecast } from '../../hooks/useCustomParcoursForecast';
import ARForecasts from './ARForecasts';

interface Props {
  points: [number, number][];
}

const ARCustomParcoursForecasts = ({ points }: Props) => {
  const [indices, isLoading, error] = useCustomParcoursForecast(points);

  return <ARForecasts indices={indices} isLoading={isLoading} error={error} />;
};

export default ARCustomParcoursForecasts;
