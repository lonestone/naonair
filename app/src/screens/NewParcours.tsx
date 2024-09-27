import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Portal, Surface } from 'react-native-paper';
import ARMap, { ARMapHandle } from '@atoms/ARMap';
import { Position } from '@turf/turf';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@theme';
import ARFloatingBackButton from '@molecules/ARFloatingBackButton';
import ARParcoursSteps from '@templates/ARParcoursSteps';
import { useUserPosition } from '@hooks/useUserPosition';
import ARConfirmModal from '@templates/ARConfirmModal';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationScreenProp } from '@type/routes';
import { getBounds } from 'geolib';
import ARPathLayer from '@atoms/ARPathLayer';
import { ARParcours } from '../actions/parcours';
import ARPathMarker, { ARPathMarkerType } from '@atoms/ARPathMarker';
import ARFullScreenLoading from '@molecules/ARFullScreenLoading';
import { useCustomParcours } from '@hooks/useCustomParcours';
import { useParcours } from '@hooks/useParcours';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 3,
    paddingVertical: 30,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.white,
  },
  backButtonSafeArea: {
    position: 'absolute',
    paddingLeft: 16,
    paddingTop: 16,
    zIndex: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  backButtonContainer: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 50,
  },
});

const NewParcoursScreen = () => {
  const { userPosition: initialPosition } = useUserPosition();
  const mapRef = useRef<ARMapHandle>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<Position[]>([]);
  const { saveNewParcours } = useCustomParcours();
  const { refreshList } = useParcours();
  const [displayCurrentLocation, setDisplayCurrentLocation] = useState(true);
  const navigation = useNavigation<StackNavigationScreenProp>();

  useEffect(() => {
    if (initialPosition) {
      setPoints([initialPosition]);
    }
  }, [initialPosition, setPoints]);

  const handleBack = useCallback(() => {
    if (hasStarted) {
      setCancelModalOpen(true);
    } else {
      navigation.goBack();
    }
  }, [hasStarted, navigation]);

  const onSave = async (
    name: string,
    elapsedTime: number,
    totalDistance: number,
    averageSpeed: number,
  ) => {
    const hardPoints: Position[] = [
      [-1.6215653714205223, 47.20235598492201],
      [-1.616386323866264, 47.19888607812004],
      [-1.613848142944731, 47.19541591418511],
      [-1.6135986433884597, 47.18360051654746],
      [-1.612279601607853, 47.18162728266171],
      [-1.6078299033935168, 47.18015304935372],
      [-1.6039079055626628, 47.179032081239434],
    ];
    setLoading(true);
    setHasStarted(false);
    const bounds = getBounds(
      hardPoints.map(([longitude, latitude]) => ({ latitude, longitude })),
    );

    if (!bounds || !mapRef.current?.viewRef.current) {
      return;
    }

    setDisplayCurrentLocation(false);
    mapRef.current.setCamera({
      bounds: {
        ne: [bounds.maxLng, bounds.maxLat],
        sw: [bounds.minLng, bounds.minLat],
        paddingLeft: 50,
        paddingRight: 50,
        paddingBottom: 150,
        paddingTop: 150,
      },
    });

    setTimeout(async () => {
      const uri = await mapRef.current!.viewRef.current!.takeSnap();

      saveNewParcours({
        name,
        points: hardPoints,
        bbox: [bounds.minLng, bounds.minLat, bounds.maxLng, bounds.maxLat],
        distanceTotal: totalDistance,
        imageUri: uri,
        avgSpeed: averageSpeed,
        timeTaken: elapsedTime,
      });

      await refreshList();
      navigation.replace('Home', { screen: 'Parcours' });
    }, 3000);
  };

  return (
    <>
      {loading && <ARFullScreenLoading />}
      <ARFloatingBackButton onPress={handleBack} />
      <ARMap
        ref={mapRef}
        userLocationVisible={displayCurrentLocation}
        interactionEnabled={displayCurrentLocation}
        center={initialPosition}>
        {points.length > 1 && (
          <>
            <ARPathLayer
              path={
                {
                  geometry: {
                    type: 'MultiLineString',
                    coordinates: [points],
                  },
                } as ARParcours
              }
            />
          </>
        )}
        {(hasStarted || points.length > 0) && initialPosition && (
          <ARPathMarker
            coordinate={initialPosition}
            id="start-marker-1"
            title="Start"
            type={ARPathMarkerType.START}
          />
        )}
        {!hasStarted && points.length > 0 && (
          <ARPathMarker
            coordinate={points[points.length - 1]}
            id="end-marker-1"
            title="End"
            type={ARPathMarkerType.END}
          />
        )}
      </ARMap>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Surface style={styles.listContainer}>
          <SafeAreaView edges={['bottom', 'left', 'right']}>
            <ARParcoursSteps
              onStarted={() => setHasStarted(true)}
              onUpdate={setPoints}
              onSave={onSave}
            />
          </SafeAreaView>
        </Surface>
      </KeyboardAvoidingView>
      <Portal>
        <ARConfirmModal
          open={cancelModalOpen}
          headline="Souhaitez-vous vraiment supprimer le parcours ?"
          caption="Cette action est irréversible et supprimera votre parcours personnalisé"
          setOpen={setCancelModalOpen}
          onPress={() => {
            setCancelModalOpen(false);
            setPoints([]);
            navigation.goBack();
          }}
        />
      </Portal>
    </>
  );
};

export default NewParcoursScreen;
