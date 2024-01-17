import {
  PollenDTO,
  PollenNotificationDTO,
  PollenNotificationStatus,
} from '@aireal/dtos';
import { API } from '../config.json';

const POLLEN_URL = `${API.baseUrl}pollen`;
const NOTIFICATION_URL = `${API.baseUrl}pollenNotification`;

export interface PollenSettings {
  name: string;
  value: boolean;
}

const getPollen = async (): Promise<PollenDTO[] | null> => {
  const response = await fetch(POLLEN_URL);
  const json = await response.json();
  if (json === undefined) {
    return null;
  }

  return json;
};

const updatePollen = async (pollenToUpdate: PollenNotificationDTO) => {
  try {
    const response = await fetch(`${NOTIFICATION_URL}/update`, {
      method: 'POST',
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
    return { name: pollen.name, value: !!isSubscribe };
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
  // On save le nouveau pollen en ligne
  await updatePollen({
    pollen: pollen.name,
    status: pollen.value
      ? PollenNotificationStatus.active
      : PollenNotificationStatus.disabled,
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
