import { RouteProp, useRoute } from '@react-navigation/native';
import { Position } from '@turf/turf';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ARButton } from '../components/atoms/ARButton';
import ARElasticView from '../components/atoms/ARElasticView';
import ARNavigationMapView from '../components/organisms/ARNavigationMapView';
import ARPathInstructions from '../components/organisms/ARPathInstructions';
import { BackButton } from '../components/templates/ARChooseItinerary';
import { StackParamList } from '../types/routes';

export interface NavigationScreenProp {}

type NavigationScreenRouteProp = RouteProp<StackParamList, 'Navigation'>;

const styles = StyleSheet.create({
  map: { flex: 0 },
  instructions: {
    flex: 1,
  },
});

export default ({}: NavigationScreenProp) => {
  const { path } = useRoute<NavigationScreenRouteProp>().params || {};

  const [userPosition, setUserPosition] = useState<Position | undefined>();
  const [canScroll, setCanScroll] = useState<boolean>(false);

  return (
    <>
      <ARNavigationMapView
        path={path}
        style={styles.map}
        onUserMoved={setUserPosition}
      />
      <BackButton />
      <ARElasticView
        maxHeight={Dimensions.get('screen').height - 150}
        minHeight={130}
        onFold={() => setCanScroll(false)}
        onExpanded={() => setCanScroll(true)}>
        <>
          <TouchableOpacity
            onPress={() => {}}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              backgroundColor: 'white',
              borderRadius: 0,
              alignItems: 'center',
            }}>
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
