import { useEffect, useState } from 'react';
import { CustomParcours } from '../actions/parcours';
import { BBox, Position } from 'geojson';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const CUSTOM_PARCOURS_PREFIX = 'parcours_';

export const useCustomParcours = () => {
  const [loading, setLoading] = useState(false);
  const [parcours, setParcours] = useState<CustomParcours[]>([]);

  const getParcours = async () => {
    setLoading(true);
    const keys = (await AsyncStorage.getAllKeys()).filter(key =>
      key.startsWith(CUSTOM_PARCOURS_PREFIX),
    );

    const parcoursPromises = keys.map(key =>
      AsyncStorage.getItem(key).then(
        item => JSON.parse(item || '') as CustomParcours,
      ),
    );

    const customParcours = await Promise.all(parcoursPromises);

    setParcours(customParcours);
    setLoading(false);
  };

  const saveNewParcours = async ({
    name,
    points,
    bbox,
    distanceTotal,
    avgSpeed,
    timeTaken,
    imageUri,
  }: {
    name: string;
    points: Position[];
    bbox: BBox;
    distanceTotal: number;
    imageUri: string;
    avgSpeed: number;
    timeTaken: number;
  }) => {
    const id = uuid.v4();

    const newParcours = {
      type: 'Custom',
      geometry: {
        type: 'MultiLineString',
        coordinates: [points],
      },
      bbox,
      properties: {
        mode: 0,
        id_parcours: -1,
        id,
        date_maj: new Date().toISOString(),
        nom: name,
        km: distanceTotal,
        denivele: 0,
        cycliste: false,
        coureur: false,
        marcheur: false,
        marcheurs_temps_min: 0,
        cyclistes_temps_min: 0,
        coureurs_temps_min: 0,
        favorited: false,
        avgSpeed,
        timeTaken,
      },
      imageUri,
    } as CustomParcours;

    await AsyncStorage.setItem(
      `${CUSTOM_PARCOURS_PREFIX}${id}`,
      JSON.stringify(newParcours),
    );
    setParcours([...parcours, newParcours]);
  };

  const deleteParcours = async (id: string) => {
    await AsyncStorage.removeItem(`${CUSTOM_PARCOURS_PREFIX}${id}`);
    setParcours(parcours.filter(p => p.properties.id !== id));
  };

  useEffect(() => {
    getParcours();
  }, []);

  return {
    loading,
    parcours,
    refreshCustomParcoursList: getParcours,
    saveNewParcours,
    deleteParcours,
  };
};
