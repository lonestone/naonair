import { StackNavigationProp } from '@react-navigation/stack';
import { Position } from 'geojson';
import { POI } from '../actions/poi';

export type StackParamList = {
  Home: undefined;
  POIDetails: { poiDetails: POI };
  ChooseItinerary: { start?: Position; end?: Position };
  Favorites: undefined;
};

export type TabParamList = {
  Carte: undefined;
  Itinéraires: undefined;
  Parcours: undefined;
  Profil: undefined;
};

export type StackNavigationScreenProp = StackNavigationProp<StackParamList>;
