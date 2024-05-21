import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import ARMap from '../components/atoms/ARMap';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import ARFloatingBackButton from '../components/molecules/ARFloatingBackButton';
import ARParcoursSteps from '../components/templates/ARParcoursSteps';
import { useUserPosition } from '../hooks/useUserPosition';
import InitialPositionMarker from '../components/molecules/ARInitialPositionMarker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    flex: 0,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 3,
    height: '40%',
    paddingVertical: 30,
    paddingHorizontal: 18,
  },
  backButtonSafeArea: {
    position: 'absolute',
    paddingLeft: 16,
    paddingTop: 16,
    zIndex: 10,
  },
  backButtonContainer: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 50,
  },
});

const NewParcoursScreen = () => {
  const { userPosition: initialPosition } = useUserPosition();
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <>
      {!hasStarted && <ARFloatingBackButton />}
      <ARMap userLocationVisible interactionEnabled center={initialPosition}>
        {hasStarted && initialPosition && (
          <InitialPositionMarker position={initialPosition} />
        )}
      </ARMap>
      <Surface style={styles.listContainer}>
        <SafeAreaView edges={['bottom', 'left', 'right']}>
          <ARParcoursSteps
            onStarted={() => setHasStarted(true)}
            onStopped={() => setHasStarted(false)}
          />
        </SafeAreaView>
      </Surface>
    </>
  );
};

export default NewParcoursScreen;
