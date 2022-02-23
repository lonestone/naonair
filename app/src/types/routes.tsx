import { StackNavigationProp } from '@react-navigation/stack';
import { Position } from 'geojson';
import { ARParcours } from '../actions/parcours';
import { POI } from '../actions/poi';
import { ARPath, RouteProfile } from '../actions/routes';

export type StackParamList = {
  Home: undefined;
  POIDetails: { poi: POI };
  ChooseItinerary: {
    start?: Position;
    end?: Position;
    transportMode: RouteProfile;
  };
  Favorites: undefined;
  Navigation: { path: ARPath };
  RouteDetail: { parcours: ARParcours };
  CreatePlace: undefined;
};

export type TabParamList = {
  Carte: undefined;
  Itinéraires: undefined;
  Parcours: undefined;
  Profil: undefined;
};

export type StackNavigationScreenProp = StackNavigationProp<StackParamList>;
