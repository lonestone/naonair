import {
  PollenDTO,
  PollenNotificationDTO,
  UpdatePollenNotificationDTO,
} from '@aireal/dtos';
import { API } from '../config.json';

const POLLEN_URL = `${API.baseUrl}pollen`;
const NOTIFICATION_URL = `${API.baseUrl}pollenNotification`;

export interface PollenSettings {
  name: string;
  value: boolean;
  group: string;
}

const getPollen = async (): Promise<PollenDTO[] | null> => {
  const response = await fetch(POLLEN_URL);
  const json = await response.json();
  if (json === undefined) {
    return null;
  }

  return json;
};

const updatePollen = async (pollenToUpdate: UpdatePollenNotificationDTO) => {
  try {
    const response = await fetch(`${NOTIFICATION_URL}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pollenToUpdate),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    return null;
  }
};

const formatPollenDTO = (
  onlinePollen: PollenDTO[],
  notifications: PollenNotificationDTO[] | null,
): PollenSettings[] => {
  return onlinePollen.map(pollen => {
    const isSubscribe =
      notifications?.find(
        notification => notification.pollen === pollen.name,
      ) || false;
    return { name: pollen.name, value: !!isSubscribe, group: pollen.group };
  });
};

// Exported methods
export const getPollenNotifications = async (
  token: string,
): Promise<PollenNotificationDTO[] | null> => {
  const response = await fetch(`${NOTIFICATION_URL}/${token}`);

  const json = await response.json();
  if (json === undefined) {
    return null;
  }

  return json;
};

export const savePollenSettings = async function (
  pollen: PollenSettings,
  fcmToken: string,
): Promise<Array<PollenSettings>> {
  await updatePollen({
    pollen: pollen.name,
    isEnabled: pollen.value,
    fcmToken,
  });

  const pollenSettings = await getPollenSettings(fcmToken);
  return pollenSettings;
};

export const getPollenSettings = async function (
  fcmToken: string | null,
): Promise<PollenSettings[]> {
  const onlinePollen = await getPollen();
  const notifications =
    fcmToken !== null ? await getPollenNotifications(fcmToken) : null;

  if (onlinePollen === null) {
    return [];
  }

  const formatedPollen: PollenSettings[] = formatPollenDTO(
    onlinePollen,
    notifications,
  );

  return formatedPollen ?? [];
};
