import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getPollen } from '../actions/pollen';
import { getPollenNotifications } from '../actions/pollenNotifications';
import { useNotifications } from '../hooks/useNotifications';

const POLLEN_NOTIFICATIONS_KEY = '@pollennotifications';

export type Notifications = {
  count: number;
  refreshNotifications: () => void;
  readNotifications: () => Promise<void>;
};

const defaultValue: Notifications = {
  count: 0,
  refreshNotifications: () => {},
  readNotifications: async () => {},
};

export const NotificationsContext = createContext<Notifications>(defaultValue);

export const NotificationsProvider = ({
  children,
}: NotificationsProviderProps) => {
  const [count, setCount] = useState(0);
  const [fcmToken, setFcmToken] = useState<string | null>();
  const { getFcmToken } = useNotifications();

  useEffect(() => {
    (async () => {
      setFcmToken(await getFcmToken());
    })();
  }, [getFcmToken]);

  const getNotificationsStates = useCallback(async () => {
    if (!fcmToken) {
      return [];
    }

    const pollens = await getPollen();
    const settings = (await getPollenNotifications(fcmToken)) || [];
    let localPollenNotificationsState = await getLocalPollenNotificationState();

    for (const pollen of pollens) {
      // First if we got already this notification in local, but this one ended
      const localIndex = localPollenNotificationsState.findIndex(
        item => item.pollenName === pollen.name,
      );
      console.log(pollen.name, '===>', localIndex);
      if (localIndex !== -1 && pollen.state !== 1) {
        console.log(localPollenNotificationsState);
        localPollenNotificationsState.splice(localIndex, 1);
        console.log(localPollenNotificationsState);
        continue;
      }

      // Then check if we care about this notification :
      const pollenSettings = settings.find(set => set.pollen === pollen.name);
      if (pollenSettings === undefined) {
        continue;
      }

      // And finaly check if wee need to add notification in local
      if (pollen.state === 1 && localIndex === -1) {
        // If the pollen state is 1 and the pollen is not in local
        // The emission started => Save it
        localPollenNotificationsState.push({
          isRead: false,
          pollenName: pollen.name,
        });
      }
      // else {
      // pollen.state !== 1 && localIndex === -1 => Not in local, not emission => Do nothing
      // pollen.state === 1 && localIndex === 1 => Already in local => do nothing
      // }
    }

    await save(localPollenNotificationsState);

    return localPollenNotificationsState.filter(item => item.isRead === false);
  }, [fcmToken]);

  const refreshNotifications = useCallback(() => {
    getNotificationsStates().then(subscribedActivePollen => {
      setCount(subscribedActivePollen.length);
    });
  }, [getNotificationsStates]);

  useEffect(() => {
    refreshNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fcmToken, getNotificationsStates]);

  const readNotifications = async () => {
    let localPollenNotificationsState = await getLocalPollenNotificationState();
    localPollenNotificationsState = localPollenNotificationsState.map(item => {
      return {
        isRead: true,
        pollenName: item.pollenName,
      } as LocalNotificationState;
    });
    await save(localPollenNotificationsState);
    refreshNotifications();
  };

  return (
    <NotificationsContext.Provider
      value={{ count, refreshNotifications, readNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

type NotificationsProviderProps = {
  children: ReactNode | ReactNode[];
};

type LocalNotificationState = {
  pollenName: string;
  isRead: boolean;
};

const getLocalPollenNotificationState = async function (): Promise<
  LocalNotificationState[]
> {
  const pollenSettings = await AsyncStorage.getItem(POLLEN_NOTIFICATIONS_KEY);
  if (!pollenSettings) {
    return [];
  }
  return JSON.parse(pollenSettings) as LocalNotificationState[];
};

const save = async (localData: LocalNotificationState[]) => {
  await AsyncStorage.setItem(
    POLLEN_NOTIFICATIONS_KEY,
    JSON.stringify(localData),
  );
};
