import { RouteProp, useRoute } from '@react-navigation/native';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { Position } from '@turf/turf';
import React, { useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ARElasticView from '../components/atoms/ARElasticView';
import ARNavigationMapView from '../components/organisms/ARNavigationMapView';
import ARPathInstructions from '../components/organisms/ARPathInstructions';

import { StackParamList } from '../types/routes';
import ARFloatingBackButton from '../components/molecules/ARFloatingBackButton';

export interface NavigationScreenProp {}

type NavigationScreenRouteProp = RouteProp<StackParamList, 'Navigation'>;

const styles = StyleSheet.create({
  map: { flex: 0 },
  instructions: {
    flex: 1,
  },
  foldButton: {
    backgroundColor: 'white',
    borderRadius: 0,
    alignItems: 'center',
  },
});

export default ({}: NavigationScreenProp) => {
  const { path } = useRoute<NavigationScreenRouteProp>().params || {};

  useKeepAwake();

  const [userPosition, setUserPosition] = useState<Position | undefined>();
  const [canScroll, setCanScroll] = useState<boolean>(false);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ARNavigationMapView
        path={path}
        style={styles.map}
        onUserMoved={setUserPosition}
      />
      <ARFloatingBackButton />
      <ARElasticView
        maxHeight={Dimensions.get('screen').height - 150}
        minHeight={130}
        onFold={() => setCanScroll(false)}
        onExpanded={() => setCanScroll(true)}>
        <>
          <TouchableOpacity style={styles.foldButton}>
            <Icon
              name={canScroll ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
              size={32}
              color="black"
            />
          </TouchableOpacity>
          <ARPathInstructions
            style={styles.instructions}
            path={path}
            userPosition={userPosition}
            scrollEnabled={canScroll}
          />
        </>
      </ARElasticView>
    </>
  );
};
