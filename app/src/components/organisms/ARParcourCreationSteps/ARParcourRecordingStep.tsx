import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { StyleSheet, View, ViewProps } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { ARButton, ARButtonSize } from '../../atoms/ARButton';
import { theme } from '../../../theme';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import ARParcourRecordingDataItem from '../../molecules/ARParcourRecordingDataItem';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import Geolocation, {
  GeoCoordinates,
  GeoPosition,
} from 'react-native-geolocation-service';
import { Position } from 'geojson';
import { getDistance } from 'geolib';
import ARConfirmModal from '../../templates/ARConfirmModal';
import { formatTime } from '../../../utils/formatTime';

type ARParcourRecordingStepProps = {
  onEnded: (
    elapsedTime: number,
    totalDistance: number,
    averageSpeed: number,
  ) => void;
  onPointsUpdate: (point: Position[]) => void;
} & ViewProps;

const style = StyleSheet.create({
  container: {
    height: '100%',
  },
  description: {
    marginTop: 12,
    color: theme.colors.blue[300],
    fontSize: 18,
    lineHeight: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  action: {
    marginTop: 38,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnLabel: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  pauseBtn: {
    backgroundColor: theme.colors.warning,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  stopBtn: {
    backgroundColor: theme.colors.error,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  resumeBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  data: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  dataColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '45%',
  },
});

const MAX_GET_LOCATION_INTERVAL = 500;
const DISTANCE_FILTER = 10;

function meterPerSecondToKmPerHour(speed: number): number {
  return (speed * 3600) / 1000;
}

export default ({
  onEnded,
  onPointsUpdate,
  ...props
}: ARParcourRecordingStepProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const pauseIcon = useCallback(
    () => <Ionicons name="pause-circle" size={18} color="white" />,
    [],
  );
  const stopIcon = useCallback(
    () => <Ionicons name="stop-circle" size={18} color="white" />,
    [],
  );
  const resumeIcon = useCallback(
    () => <FA5Icon name="location-arrow" size={18} color="white" />,
    [],
  );
  const [isRecording, setIsRecording] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pathPoints, setPathPoints] = useState<GeoCoordinates[]>([]);
  const totalDistance = useMemo(() => {
    let distance = 0;
    for (let i = 0; i < pathPoints.length - 1; i++) {
      distance += getDistance(pathPoints[i], pathPoints[i + 1]) / 1000;
    }
    return distance;
  }, [pathPoints]);

  const currentSpeed = useMemo(() => {
    if (pathPoints.length > 0) {
      const latestMeasure = pathPoints[pathPoints.length - 1];

      if (!latestMeasure?.speed) {
        return 0;
      }

      return latestMeasure.speed > 0 ? latestMeasure.speed : 0;
    }
    return 0;
  }, [pathPoints]);

  const averageSpeed = useMemo(() => {
    let speed = 0;
    const total = pathPoints.length > 0 ? pathPoints.length : 1;
    pathPoints.forEach(point => (speed += point?.speed ?? 0));

    return speed / total > 0 ? speed / total : 0;
  }, [pathPoints]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRecording) {
        setElapsedTime(elapsedTime + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, elapsedTime]);

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
        onPointsUpdate(
          all.map(({ latitude, longitude }) => [longitude, latitude]),
        );
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

  return (
    <>
      <View
        {...props}
        style={StyleSheet.flatten([style.container, props.style])}>
        <Text style={style.title}>Parcours en cours d’enregistrement</Text>
        <View style={style.data}>
          <View style={style.dataColumn}>
            <ARParcourRecordingDataItem
              title="Temps"
              value={formatTime(elapsedTime)}
            />
            <ARParcourRecordingDataItem
              title="Vitesse actuelle"
              value={`${meterPerSecondToKmPerHour(currentSpeed).toFixed(
                2,
              )} km/h`}
            />
          </View>
          <View style={style.dataColumn}>
            <ARParcourRecordingDataItem
              title="Distance"
              value={`${totalDistance.toFixed(2)} km`}
            />
            <ARParcourRecordingDataItem
              title="Vitesse moyenne"
              value={`${meterPerSecondToKmPerHour(averageSpeed).toFixed(
                2,
              )} km/h`}
            />
          </View>
        </View>
        <View style={style.action}>
          {isRecording && (
            <ARButton
              onPress={() => {
                setIsRecording(!isRecording);
              }}
              size={ARButtonSize.Xsmall}
              label="Mettre en pause"
              icon={pauseIcon}
              styleContainer={style.pauseBtn}
              labelStyle={style.btnLabel}
            />
          )}
          {!isRecording && (
            <ARButton
              onPress={() => {
                setIsRecording(!isRecording);
              }}
              size={ARButtonSize.Xsmall}
              label="Reprendre"
              icon={resumeIcon}
              styleContainer={style.resumeBtn}
              labelStyle={style.btnLabel}
            />
          )}
          <ARButton
            onPress={() => {
              setModalOpen(true);
            }}
            size={ARButtonSize.Xsmall}
            label="Terminer"
            icon={stopIcon}
            styleContainer={style.stopBtn}
            labelStyle={style.btnLabel}
          />
        </View>
      </View>
      <Portal>
        <ARConfirmModal
          headline="Souhaitez-vous vraiment arrêter l’enregistrement ?"
          caption="Cette action est irréversible et enregistrera votre nouveau parcours personnalisé"
          open={modalOpen}
          onPress={() => {
            setModalOpen(false);
            Geolocation.stopObserving();
            setIsRecording(false);
            onEnded(
              elapsedTime,
              totalDistance,
              meterPerSecondToKmPerHour(averageSpeed),
            );
          }}
          setOpen={setModalOpen}
        />
      </Portal>
    </>
  );
};
