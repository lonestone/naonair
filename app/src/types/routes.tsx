import { StackNavigationProp } from '@react-navigation/stack';

export type StackParamList = {
  Home: {};
  ChooseItinerary: {};
  Details: {};
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
