import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import MapScreen from './MapScreen';
import RoutesScreen from './RoutesScreen';

const Tab = createMaterialBottomTabNavigator();

export default () => {
  return (
    <Tab.Navigator screenOptions={{}}>
      <Tab.Screen
        name="Carte"
        component={MapScreen}
        options={{tabBarIcon: 'map'}}
      />
      <Tab.Screen
        name="Itinéraires"
        options={{tabBarIcon: 'run'}}
        component={RoutesScreen}
      />
    </Tab.Navigator>
  );
};
