import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import ARNavigationMapView from '../components/organisms/ARNavigationMapView';
import { StackParamList } from '../types/routes';

export interface NavigationScreenProp {}

type NavigationScreenRouteProp = RouteProp<StackParamList, 'Navigation'>;

export default ({}: NavigationScreenProp) => {
  const { path } = useRoute<NavigationScreenRouteProp>().params || {};

  return (
    <>
      <ARNavigationMapView path={path} />
      <View></View>
    </>
  );
};
