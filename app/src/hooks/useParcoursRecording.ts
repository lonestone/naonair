import { useEffect, useState } from 'react';
import Geolocation, {
  GeoCoordinates,
  GeoPosition,
} from 'react-native-geolocation-service';

const MAX_GET_LOCATION_INTERVAL = 500;
const DISTANCE_FILTER = 10;

export const useParcoursRecording = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pathPoints, setPathPoints] = useState<GeoCoordinates[]>([]);

  const startRecording = () => {
    let pP = [...pathPoints];

    Geolocation.watchPosition(
      (position: GeoPosition) => {
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
        accuracy: {
          android: 'high',
          ios: 'best',
        },
      },
    );
  };

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      Geolocation.stopObserving();
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

  const stopRecording = () => {
    Geolocation.stopObserving();
    setIsRecording(false);
  };

  return {
    isRecording,
    elapsedTime,
    pathPoints,
    stopRecording,
    setIsRecording,
  };
};
