import { RouteProp, useRoute } from '@react-navigation/native';
import { Position } from '@turf/turf';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import ARNavigationMapView from '../components/organisms/ARNavigationMapView';
import ARPathInstructions from '../components/organisms/ARPathInstructions';
import { StackParamList } from '../types/routes';

export interface NavigationScreenProp {}

type NavigationScreenRouteProp = RouteProp<StackParamList, 'Navigation'>;

const styles = StyleSheet.create({
  map: { flex: 0 },
  instructions: {
    flex: 0,
    height: 200,
  },
});

export default ({}: NavigationScreenProp) => {
  const { path } = useRoute<NavigationScreenRouteProp>().params || {};

  const [userPosition, setUserPosition] = useState<Position | undefined>();

  return (
    <>
      <ARNavigationMapView
        path={path}
        style={styles.map}
        onUserMoved={setUserPosition}
      />
        <ARPathInstructions
          style={styles.instructions}
          path={path}
          userPosition={userPosition}
        />
    </>
  );
};
