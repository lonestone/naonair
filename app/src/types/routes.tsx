import { StackNavigationProp } from '@react-navigation/stack';
import { Position } from 'geojson';
import { POI } from '../actions/poi';

export type StackParamList = {
  Home: undefined;
  POIDetails: { poiDetails: POI };
  Favorites: undefined;
  ChooseItinerary: { start: Position; end: Position };
};

export type TabParamList = {
  Carte: undefined;
  Itinéraires: undefined;
  Parcours: undefined;
  Profil: undefined;
};

export type NavigationScreenProp = StackNavigationProp<
  StackParamList,
  'POIDetails'
>;
