import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react';
import { getPollen } from '../actions/pollen';
import { getPollenNotifications } from '../actions/pollenNotifications';
import { useNotifications } from '../hooks/useNotifications';

export type Notifications = {
  count: number;
  refreshNotifications: () => void;
};

const defaultValue: Notifications = {
  count: 0,
  refreshNotifications: () => {},
};

export const NotificationsContext = createContext<Notifications>(defaultValue);

type NotificationsProviderProps = {
  children: ReactNode | ReactNode[];
};

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

  const getNewNotifications = useCallback(async () => {
    if (!fcmToken) {
      return [];
    }
    const pollens = await getPollen();
    const settings = (await getPollenNotifications(fcmToken)) || [];

    const subscribedActivePollen = pollens.filter(pollen => {
      const test = settings.find(set => set.pollen === pollen.name);
      return pollen.state === 1 && !!test;
    });

    return subscribedActivePollen;
  }, [fcmToken]);

  const refreshNotifications = useCallback(() => {
    console.log('NOP');
    getNewNotifications().then(subscribedActivePollen => {
      setCount(subscribedActivePollen.length);
    });
  }, [getNewNotifications]);

  useEffect(() => {
    refreshNotifications();
  }, [fcmToken, getNewNotifications]);

  useEffect(() => {
    console.log('-------->', count);
  }, [count]);

  return (
    <NotificationsContext.Provider value={{ count, refreshNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};
