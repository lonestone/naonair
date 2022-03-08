import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { ParamListBase, Route } from '@react-navigation/routers';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp
} from '@react-navigation/stack';
import React from 'react';
import { removePlaceStorage } from '../actions/myplaces';
import { POI } from '../actions/poi';
import ARCommonHeader from '../components/molecules/ARCommonHeader';
import ARChooseItinerary from '../components/templates/ARChooseItinerary';
import ARListFavorites from '../components/templates/ARListFavorites';
import ARPlaceFormLayout from '../components/templates/ARPlaceFormLayout';
import ARPOIDetails from '../components/templates/ARPOIDetails';
import ARRouteDetail from '../components/templates/ARRouteDetail';
import useSnackbar, { SnackbarProvider } from '../contexts/snackbar.context';
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
  route: Route<string, undefined | {}>;
  navigation: StackNavigationProp<ParamListBase>;
}

const CustomNavigationBar = ({ navigation, route }: Props) => {
  const { setSnackbarStatus } = useSnackbar();
  const param = route.params as { poi: POI };
  const handleRemove = async (id: string) => {
    await removePlaceStorage(id);

    navigation.goBack();

    setSnackbarStatus?.({
      isVisible: true,
      label: "L'adresse a été bien été suprimée",
      icon: 'check-circle',
      backgroundColor: theme.colors.quality.main.green,
    });
  };

  return (
    <ARCommonHeader
      headline={param && param.poi ? "Modifier l'adresse" : 'Créer une adresse'}
      back
      deleteIcon={!!param}
      onDelete={() => handleRemove(param.poi.id as string)}
      onBack={navigation.goBack}
    />
  );
};
