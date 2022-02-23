import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import ARCommonHeader from '../components/molecules/ARCommonHeader';
import ARChooseItinerary from '../components/templates/ARChooseItinerary';
import ARCreatePlace from '../components/templates/ARCreatePlace';
import ARListFavorites from '../components/templates/ARListFavorites';
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

const options: StackNavigationOptions = {
  header: ({ options, navigation }) => (
    <ARCommonHeader
      headline={options.headerTitle as string}
      back={navigation.canGoBack()}
      onBack={navigation.goBack}
    />
  ),
};

export default () => {
  return (
    <Stack.Navigator screenOptions={options}>
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
        name="POIDetails"
        component={ARPOIDetails}
        options={{ headerTitle: 'Détails' }}
      />

      <Stack.Screen
        name="Favorites"
        component={ARListFavorites}
        options={{ headerTitle: 'Mes favoris' }}
      />

      <Stack.Screen
        name="CreatePlace"
        component={ARCreatePlace}
        options={{ headerTitle: 'Créer une nouvelle adresse' }}
      />
    </Stack.Navigator>
  );
};
