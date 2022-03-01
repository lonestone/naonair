import { RouteProp } from '@react-navigation/core';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { ParamListBase, Route } from '@react-navigation/routers';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import { Appbar } from 'react-native-paper';
import ARCommonHeader from '../components/molecules/ARCommonHeader';
import ARChooseItinerary from '../components/templates/ARChooseItinerary';
import ARListFavorites from '../components/templates/ARListFavorites';
import ARPlaceFormLayout from '../components/templates/ARPlaceFormLayout';
import ARPOIDetails from '../components/templates/ARPOIDetails';
import ARRouteDetail from '../components/templates/ARRouteDetail';
import { SnackbarProvider } from '../contexts/snackbar.context';
import { theme } from '../theme';
import { StackParamList, TabParamList } from '../types/routes';
import ItineraryScreen from './ItineraryScreen';
import MapScreen from './MapScreen';
import NavigationScreen from './NavigationScreen';
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
    <SnackbarProvider>
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
          name="Navigation"
          component={NavigationScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RouteDetail"
          component={ARRouteDetail}
          options={{ headerTitle: 'Détail' }}
        />

        <Stack.Screen
          name="PlaceForm"
          component={ARPlaceFormLayout}
          options={{ header: props => <CustomNavigationBar {...props} /> }}
        />
      </Stack.Navigator>
    </SnackbarProvider>
  );
};

interface Props {
  route: any
  navigation: StackNavigationProp<ParamListBase>;
}

const CustomNavigationBar = ({ navigation, route }: Props) => {  
  return (
    <Appbar.Header
      style={{
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.accent,
        borderWidth: 1,
        shadowColor: theme.colors.accent,
        shadowOffset: { height: 8, width: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
      }}>
      <Appbar.BackAction onPress={navigation.goBack} />
      {route.params ? (
        <>
          <Appbar.Content title="Modifier l'adresse" />
          <Appbar.Action icon="delete" color="red" onPress={() => {}} />
        </>
      ) : (
        <Appbar.Content title="Créer une adresse" />
      )}
    </Appbar.Header>
  );
};
