import { useEffect, useState } from 'react';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

const MAX_GET_LOCATION_INTERVAL = 500;
//const DISTANCE_FILTER = 10;
const DISTANCE_FILTER = 1;

export const useParcoursRecording = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pathPoints, setPathPoints] = useState<any[]>([]);

  const startRecording = () => {
    let pP = [...pathPoints];

    const localWatchId = Geolocation.watchPosition(
      (position: GeolocationResponse) => {
        if (position.coords.latitude === 0 && position.coords.longitude === 0) {
          return;
        }

        const all = [...pP, position.coords];
        setPathPoints(all);
        pP = all;
      },
      error => {
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
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRecording) {
        setElapsedTime(elapsedTime + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, elapsedTime]);

  return {
    isRecording,
    elapsedTime,
    pathPoints,
    stopRecording,
    setIsRecording,
  };
};
