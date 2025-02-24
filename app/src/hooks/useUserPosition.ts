import { Position } from 'geojson';
import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

export const useUserPosition = function () {
  const [userPosition, setUserPosition] = useState<Position | undefined>();

  useEffect(() => {
    Geolocation.getCurrentPosition(({ coords }) => {
      setUserPosition([coords.longitude, coords.latitude]);
    });
  }, [setUserPosition]);

  return { userPosition };
};
