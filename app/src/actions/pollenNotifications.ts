import {
  PollenDTO,
  PollenNotificationDTO,
  UpdatePollenNotificationDTO,
} from '@aireal/dtos';
import { API } from '../config.json';
import { getPollen } from './pollen';

const NOTIFICATION_URL = `${API.baseUrl}pollenNotification`;

export interface PollenSettings {
  name: string;
  value: boolean;
  group: string;
}

const updatePollenNotifications = async (
  pollenToUpdate: UpdatePollenNotificationDTO,
) => {
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

/**
 * This function is used to return an array with the user settings by combine online pollen and user notification's settings
 * @param onlinePollen : All the pollens from the api, but with no settings value
 * @param notifications : All user subscribe notification
 * @returns All the pollen with the user sub values : an PollenSettings array
 */
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
  await updatePollenNotifications({
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
  console.log(onlinePollen);
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
