import { PollenDTO, PollenNotificationDTO } from '@aireal/dtos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../config.json';

const POLLEN_URL = `${API.baseUrl}pollen`;
const NOTIFICATION_URL = `${API.baseUrl}pollenNotification`;
const POLLEN_SETTINGS_KEY = '@pollensettings';

export interface PollenSettings {
  name: string;
  value: boolean;
}

export const getPollen = async (): Promise<PollenDTO[] | null> => {
  const response = await fetch(POLLEN_URL);
  const json = await response.json();
  if (json === undefined) {
    return null;
  }

  return json;
};

export const getPollenNotifications = async (
  token: string,
): Promise<PollenNotificationDTO[] | null> => {
  const response = await fetch(`${NOTIFICATION_URL}/${token}`);
  console.log(response);
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
  const notifications = await getPollenNotifications('testtat');

  console.log(notifications);

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
      .map(pollen => {
        const isSubscribe = notifications?.find(
          notification => notification.pollen === pollen.name,
        );
        return { name: pollen.name, value: !!isSubscribe };
      }),
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
