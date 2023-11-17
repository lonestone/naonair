import { PollenDTO } from '@aireal/dtos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../config.json';

const ALERTS_URL = `${API.baseUrl}pollen`;
const POLLEN_SETTINGS_KEY = '@pollensettings';

export interface PollenSettings {
  name: string;
  value: boolean;
}

export const getPollen = async (): Promise<PollenDTO[] | null> => {
  const response = await fetch(ALERTS_URL);
  const json = await response.json();
  if (json === undefined) {
    return null;
  }

  return json;
};

export const savePollenSettings = async function (settings: PollenSettings[]) {
  const formatedFavorites = JSON.stringify(settings);
  await AsyncStorage.setItem(POLLEN_SETTINGS_KEY, formatedFavorites);
};

export const getPollenSettings = async function (): Promise<PollenSettings[]> {
  const localSettings = await getLocalPollenSettings();
  const onlinePollen = await getPollen();

  if (onlinePollen === null) {
    return localSettings;
  }

  const filteredLocalSettings = localSettings.filter(localSetting =>
    onlinePollen.some(pollen => pollen.name === localSetting.name),
  );

  const updatedSettings: PollenSettings[] = [
    ...filteredLocalSettings,
    ...onlinePollen
      .filter(
        pollen =>
          !filteredLocalSettings.some(
            localSetting => localSetting.name === pollen.name,
          ),
      )
      .map(pollen => ({ name: pollen.name, value: false })),
  ];

  return updatedSettings ?? [];
};

const getLocalPollenSettings = async function (): Promise<PollenSettings[]> {
  const pollenSettings = await AsyncStorage.getItem(POLLEN_SETTINGS_KEY);
  if (!pollenSettings) {
    return [];
  }
  return JSON.parse(pollenSettings) as PollenSettings[];
};
