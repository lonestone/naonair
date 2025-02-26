import { useEffect, useMemo, useState } from 'react';
import Geolocation, { GeolocationError, GeolocationResponse } from '@react-native-community/geolocation';

const MAX_GET_LOCATION_INTERVAL = 500;
//const DISTANCE_FILTER = 10;
const DISTANCE_FILTER = 1;

export const useParcoursRecording = () => {
  const [watchId, setWatchId] = useState<number | null>(null);
  const isRecording = useMemo(() => watchId !== null, [watchId]);
  const [pathPoints, setPathPoints] = useState<any[]>([]);

  const [ticks, setTicks] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [previousElapsedTime, setPreviousElapsedTime] = useState(0);

  //console.log('useParcoursRecording');

  // 1hz clock, use it as a dependency on siblings hooks
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTicks(ticks + 1);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [ticks]);

  const recentElapsedTime = useMemo(() => {
    if (startTime) {
      return Math.floor((Date.now() - startTime) / 1000);
    }
    return 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks, startTime]);

  const elapsedTime = useMemo(() => {
    return recentElapsedTime + previousElapsedTime;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks, recentElapsedTime, previousElapsedTime]);

  const startRecording = () => {
    console.log('startRecording');

    setStartTime((prev) => prev ?? Date.now());

    const localWatchId = Geolocation.watchPosition(
      (position: GeolocationResponse) => {
        console.log('hey position', position);
        if (position.coords.latitude === 0 && position.coords.longitude === 0) {
          return;
        }

        setPathPoints((points) => [...points, position.coords]);
      },
      (error: GeolocationError) => {
        console.log(error);
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        interval: MAX_GET_LOCATION_INTERVAL,
        fastestInterval: MAX_GET_LOCATION_INTERVAL,
        distanceFilter: DISTANCE_FILTER,
      },
    );
    setWatchId(localWatchId);
  };

  const stopRecording = () => {
    console.log('stopRecording');
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
      setPreviousElapsedTime(elapsedTime);
      setStartTime(null);
    }
  };

  useEffect(() => {
    startRecording();
  }, []);

  return {
    isRecording,
    elapsedTime,
    pathPoints,
    startRecording,
    stopRecording,
  };
};
