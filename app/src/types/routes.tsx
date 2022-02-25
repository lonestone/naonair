import { StackNavigationProp } from '@react-navigation/stack';
import { Position } from 'geojson';
import { POI } from '../actions/poi';
import { ARPath } from '../actions/routes';

export type StackParamList = {
  Home: undefined;
  POIDetails: { poi: POI };
  ChooseItinerary: { start?: Position; end?: Position };
  Favorites: undefined;
  Navigation: { path: ARPath };
};

export type TabParamList = {
  Carte: undefined;
  Itinéraires: undefined;
  Parcours: undefined;
  Profil: undefined;
};

export type StackNavigationScreenProp = StackNavigationProp<StackParamList>;
