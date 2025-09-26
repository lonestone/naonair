/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { Provider } from 'react-native-paper';
import { SENTRY } from './config.json';
import { NotificationsProvider } from './contexts/notifications.context';
import { useNotifications } from './hooks/useNotifications';
import Screens from './screens/NavigatorScreen';
import { theme } from './theme';
import { configureGeolocationLibrary } from './actions/location';
import { StackParamList } from './types/routes';

const linking = {
  prefixes: ['https://naonair.app'],
  config: {
    screens: {
      Home: {
        screens: {
          Carte: 'map',
        },
      },
      POIDetails: 'poi/:poiId',
    },
  },
};


if (!__DEV__) {
  Sentry.init({
    dsn: SENTRY.dsn,
  });
}

LogBox.ignoreAllLogs();

const App = () => {
  const { notificationListener, requestUserPermission } = useNotifications();
  useEffect(() => {
    configureGeolocationLibrary();
  }, []);

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, [notificationListener, requestUserPermission]);

  return (
    <Provider theme={theme}>
      <NotificationsProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.white}
        />
        <NavigationContainer linking={linking}>
          <Screens />
        </NavigationContainer>
      </NotificationsProvider>
    </Provider>
  );
};

const Wrapper = __DEV__ ? App : Sentry.wrap(App);

export default Wrapper;
