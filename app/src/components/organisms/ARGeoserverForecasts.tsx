import React from 'react';
import { useForecast } from '@hooks/useForecast';
import ARForecasts from './ARForecasts';

interface Props {
  id: number;
  type: 'aireel:poi_data' | 'aireel:parcours_data';
}

const ARGeoserverForecasts = ({ id, type }: Props) => {
  const [indices, isLoading, error] = useForecast(id, type);

  return <ARForecasts indices={indices} isLoading={isLoading} error={error} />;
};

export default ARGeoserverForecasts;
