import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getCGUAccepted, getIsFirstLaunched } from '../actions/launch';
import ARCommonHeader from '../components/molecules/ARCommonHeader';
import ARChooseItinerary from '../components/templates/ARChooseItinerary';
import ARListFavorites from '../components/templates/ARListFavorites';
import ARPlaceFormLayout from '../components/templates/ARPlaceFormLayout';
import ARPOIDetails from '../components/templates/ARPOIDetails';
import ARRouteDetail from '../components/templates/ARRouteDetail';
import { SnackbarProvider } from '../contexts/snackbar.context';
import { theme } from '../theme';
import { StackParamList, TabParamList } from '../types/routes';
import CGUScreen from './CGUScreen';
import ItineraryScreen from './ItineraryScreen';
import MapScreen from './MapScreen';
import NavigationScreen from './NavigationScreen';
import OnboardingScreen from './OnboardingScreen';
import ProfileScreen from './ProfileScreen';
import RoutesScreen from './RoutesScreen';
import { Platform } from 'react-native';
import BackButton from '../components/molecules/ARBackButton';

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
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          paddingVertical: 12,
          height: (Platform.OS === 'ios' ? 60 : 70) + bottom,
          // paddingBottom: 20,
        },
        tabBarLabelStyle: {
          marginBottom: 5,
        },
        headerShown: false,
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: 'rgba(255,255,255, 0.6)',

        tabBarIcon: ({ color }) => (
          <Icon name={routeIcon[route.name]} size={30} color={color} />
        ),
      })}>
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Itinéraires" component={ItineraryScreen} />
      <Tab.Screen name="Parcours" component={RoutesScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const options: StackNavigationOptions = {
  header: ({ options }) => (
    <ARCommonHeader
      headline={options.headerTitle as string}
      left={<BackButton />}
    />
  ),
};

export default () => {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState<boolean>(true);
  const [isCGUAccepted, setIsCGUAccepted] = useState<string>();
  const [isReady, setIsReady] = useState<boolean>(false);

  const firstLaunched = useCallback(async () => {
    const isFirstLaunched = await getIsFirstLaunched();
    const CGUAccepted = await getCGUAccepted();

    setIsCGUAccepted(CGUAccepted);

    if (isFirstLaunched === null) {
      setIsAppFirstLaunched(true);
    } else {
      setIsAppFirstLaunched(false);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    firstLaunched();
  }, [firstLaunched]);

  const handleScreenOnLaunch = useMemo(() => {
    if (isAppFirstLaunched) {
      return 'Onboarding' as keyof StackParamList;
    } else if (!isAppFirstLaunched && isCGUAccepted === null) {
      return 'CGU' as keyof StackParamList;
    } else {
      return 'Home' as keyof StackParamList;
    }
  }, [isAppFirstLaunched, isCGUAccepted]);

  if (!isReady) {
    return null;
  }

  return (
    <SnackbarProvider>
      <Stack.Navigator
        screenOptions={options}
        initialRouteName={handleScreenOnLaunch}>
        <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
          {() => <OnboardingScreen CGUAccepted={isCGUAccepted} />}
        </Stack.Screen>
        <Stack.Screen
          name="CGU"
          component={CGUScreen}
          options={{
            headerTitle: "Conditions Générales d'Utilisation",
          }}
        />

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
          options={{ headerShown: false }}
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
          options={{ headerTitle: 'Détails' }}
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
