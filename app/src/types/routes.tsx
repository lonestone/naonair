import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { Position } from 'geojson';
import { ARParcours } from '../actions/parcours';
import { POI } from '../actions/poi';
import { ARPath, RouteProfile } from '../actions/routes';

export type StackParamList = {
  Onboarding: undefined;
  Home: undefined;
  POIDetails: { poi: POI };
  ChooseItinerary: {
    start?: Position;
    end?: Position;
    transportMode: RouteProfile;
  };
  Favorites: undefined;
  Navigation: { path: ARPath };
  RouteDetail: { parcours: ARParcours; qa?: number };
  PlaceForm: undefined | { poi: POI };
};

export type TabParamList = {
  Carte: undefined;
  Itinéraires: {
    start?: { coord: Position; text: string };
    end?: { coord: Position; text: string };
  };
  Parcours: undefined;
  Profil: undefined;
};

export type StackNavigationScreenProp = StackNavigationProp<StackParamList>;
export type TabNavigationScreenProp =
  MaterialBottomTabNavigationProp<TabParamList>;
