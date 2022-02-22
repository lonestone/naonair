import { StackNavigationProp } from '@react-navigation/stack';
import { Position } from 'geojson';
import { POI } from '../actions/poi';

export type StackParamList = {
  Home: undefined;
  ChooseItinerary: { start: Position; end: Position };
  Details: { poiDetails: POI };
};

export type TabParamList = {
  Carte: {};
  Itinéraires: {};
  Parcours: {};
  Profil: {};
};

export type NavigationScreenProp = StackNavigationProp<
  StackParamList,
  'Details'
>;
