import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<StackParamList>();

const routeIcon = {
  Carte: 'map',
  Itinéraires: 'near-me',
  Parcours: 'run',
  Profil: 'account-circle',
};

const Home = () => {
  const { bottom } = useSafeAreaInsets();
  return (
    <Tab.Navigator
      defaultScreenOptions={{
        headerShown: false,
      }}
      screenOptions={({ route, navigation }) => ({
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          paddingVertical: 12,
          height: 60 + bottom,
        },
        headerShown: false,
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: 'rgba(255,255,255, 0.6)',

        tabBarIcon: ({ focused, color, size }) => (
          <Icon name={routeIcon[route.name]} size={30} color={color} />
        ),

        // tabBarIni: theme.colors.primary,
      })}
      // barStyle={{ backgroundColor: theme.colors.primary }}
      // screenOptions={({ route }) => ({
      //   // title: route.name,
      //   // tabBarIcon: <Icon name={routeIcon[route.name]} size={30} />,
      // })}
      // shifting={false}
    >
      <Tab.Screen
        name="Carte"
        component={MapScreen}
        // options={{ tabBa: <Icon name={'map'} size={30} /> }}
        // options={{ tabBarIcon: 'map' }}
      />
      <Tab.Screen
        name="Itinéraires"
        // options={{ tabBarIcon: 'near-me' }}
        component={ItineraryScreen}
      />
      <Tab.Screen
        name="Parcours"
        // options={{ tabBarIcon: 'run' }}
        component={RoutesScreen}
      />
      <Tab.Screen
        name="Profil"
        // options={{ tabBarIcon: 'account-circle' }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

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
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SnackbarProvider>
  );
};
