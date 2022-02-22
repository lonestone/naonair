import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ARChooseItinerary from '../components/templates/ARChooseItinerary';
import ARPOIDetails from '../components/templates/ARPOIDetails';
import { theme } from '../theme';
import { StackParamList, TabParamList } from '../types/routes';
import ItineraryScreen from './ItineraryScreen';
import MapScreen from './MapScreen';
import ProfileScreen from './ProfileScreen';
import RoutesScreen from './RoutesScreen';

const Tab = createMaterialBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<StackParamList>();

const Home = () => (
  <Tab.Navigator barStyle={{ backgroundColor: theme.colors.primary }}>
    <Tab.Screen
      name="Carte"
      component={MapScreen}
      options={{ tabBarIcon: 'map' }}
    />
    <Tab.Screen
      name="Itinéraires"
      options={{ tabBarIcon: 'near-me' }}
      component={ItineraryScreen}
    />
    <Tab.Screen
      name="Parcours"
      options={{ tabBarIcon: 'run' }}
      component={RoutesScreen}
    />
    <Tab.Screen
      name="Profil"
      options={{ tabBarIcon: 'account-circle' }}
      component={ProfileScreen}
    />
  </Tab.Navigator>
);

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={Home}
      />

      <Stack.Screen
        name="ChooseItinerary"
        component={ARChooseItinerary}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Details"
        component={ARPOIDetails}
        options={{ headerTitle: 'Détails' }}
      />
    </Stack.Navigator>
  );
};
