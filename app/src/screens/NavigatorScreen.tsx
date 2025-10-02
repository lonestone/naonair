import pollenIcon from '@assets/pollen-icon.svg';
import ARBadge from '@atoms/ARBadge';
import { NotificationsContext } from '@contexts/notifications.context';
import { SnackbarProvider } from '@contexts/snackbar.context';
import { useOnForegroundFocus } from '@hooks/useOnForgroundFocus';
import BackButton from '@molecules/ARBackButton';
import ARCommonHeader from '@molecules/ARCommonHeader';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import ARChooseItinerary from '@templates/ARChooseItinerary';
import ARListFavorites from '@templates/ARListFavorites';
import ARListNotifications from '@templates/ARListNotifications';
import ARPlaceFormLayout from '@templates/ARPlaceFormLayout';
import ARRouteDetail from '@templates/ARRouteDetail';
import POIDetailsWrapper from '@wrappers/POIDetailsWrapper';
import { theme } from '@theme';
import { StackParamList, TabParamList } from '@type/routes';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getCGUAccepted,
  getIsFirstLaunched,
  getIsFirstNotificationLaunched,
} from '../actions/launch';
import CGUScreen from './CGUScreen';
import ItineraryScreen from './ItineraryScreen';
import MapScreen from './MapScreen';
import NavigationScreen from './NavigationScreen';
import NewParcoursScreen from './NewParcours';
import OnboardingScreen from './OnboardingScreen';
import PollensScreen from './PollensScreen';
import ProfileScreen from './ProfileScreen';
import RoutesScreen from './RoutesScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<StackParamList>();

const routeIcon: {
  [key in keyof TabParamList]: string;
} = {
  Carte: 'map',
  Itinéraires: 'near-me',
  Parcours: 'run',
  Pollens: 'pollen',
  Profil: 'account-circle',
};

const getTabBarIcon =
  (routeName: keyof TabParamList, notificationCount: number) =>
  ({
    color,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }): React.ReactNode => {
    const name = routeIcon[routeName];
    if (name !== 'pollen') {
      return <Icon name={name} size={30} color={color} />;
    } else {
      return (
        <View style={{ position: 'relative' }}>
          <SvgXml width={30} height={30} fill={color} xml={pollenIcon} />
          {notificationCount > 0 && <ARBadge text={notificationCount} />}
        </View>
      );
    }
  };

const Home = () => {
  const { bottom } = useSafeAreaInsets();
  const { count, setAllPollenNotificationsToTrue } =
    useContext(NotificationsContext);

  useEffect(() => {
    getIsFirstNotificationLaunched(setAllPollenNotificationsToTrue);
  }, []);

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

        tabBarIcon: getTabBarIcon(route.name, count),
      })}>
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Itinéraires" component={ItineraryScreen} />
      <Tab.Screen name="Parcours" component={RoutesScreen} />
      <Tab.Screen name="Pollens" component={PollensScreen} />
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

  const { refreshNotifications } = useContext(NotificationsContext);

  useOnForegroundFocus(() => {
    refreshNotifications();
  }, true);

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
    refreshNotifications();
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
          component={POIDetailsWrapper}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Favorites"
          component={ARListFavorites}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Notifications"
          component={ARListNotifications}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Navigation"
          component={NavigationScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RouteDetail"
          component={ARRouteDetail}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PlaceForm"
          component={ARPlaceFormLayout}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="NewParcours"
          component={NewParcoursScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SnackbarProvider>
  );
};
