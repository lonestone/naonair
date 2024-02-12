import { API } from '../config.json';

const ALERTS_NOTIFICATIONS_URL = `${API.baseUrl}alertsNotification`;

// A tester
export const getAlertsNotifications = async (token: string) => {
  console.log('====>');
  const response = await fetch(`${ALERTS_NOTIFICATIONS_URL}/${token}`);
  const json = await response.json();
  console.log(json);
  if (json === undefined) {
    return null;
  }

  return json;
};

export const updateAlertsNotifications = async (
  token: string,
  value: boolean,
) => {
  console.log('Salut');
  try {
    const response = await fetch(`${ALERTS_NOTIFICATIONS_URL}`, {
      method: value ? 'POST' : 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcmToken: token }),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    return null;
  }
};
