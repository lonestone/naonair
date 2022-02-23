import { StackNavigationProp } from '@react-navigation/stack';
import { POI } from '../actions/poi';

export type StackParamList = {
  Home: undefined;
  ChooseItinerary: undefined;
  POIDetails: { poiDetails: POI };
  Favorites: undefined;
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
