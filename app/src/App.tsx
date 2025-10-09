/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import React, { useEffect } from 'react';
import { AppState, Linking, LogBox, StatusBar } from 'react-native';
import { Provider } from 'react-native-paper';
import { configureGeolocationLibrary } from './actions/location';
import { SENTRY } from './config.json';
import { NotificationsProvider } from './contexts/notifications.context';
import { useNotifications } from './hooks/useNotifications';
import Screens from './screens/NavigatorScreen';
import { theme } from './theme';
import { StackParamList } from './types/routes';

// Create navigation reference for programmatic navigation
const navigationRef = createNavigationContainerRef<StackParamList>();

// Store pending deep link URL when app is not ready
let pendingDeepLinkUrl: string | null = null;

const linking = {
  prefixes: ['https://app.naonair.org', 'naonair://'],
  config: {
    screens: {
      POIDetails: {
        path: 'poi',
        parse: {
          poiId: (poiId: string) => poiId,
        },
      },
    },
  },
};

// Function to extract POI ID from URL
const extractPoiIdFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const poiId = urlObj.searchParams.get('id');
    return poiId;
  } catch (error) {
    return null;
  }
};

// Function to handle deep link navigation
const handleDeepLinkNavigation = (url: string) => {
  // Extract POI ID from URL
  const poiId = extractPoiIdFromUrl(url);
  if (poiId) {
    // Check if navigation is ready
    if (navigationRef.current) {
      navigationRef.current.navigate('POIDetails', { poiId });
    } else {
      pendingDeepLinkUrl = url;
    }
  }
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

  useEffect(() => {
    // Listen for URL events when app is already running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // Extract POI ID and navigate directly
      const poiId = extractPoiIdFromUrl(url);
      if (poiId) {
        // Wait a bit for the app to be fully active, then navigate
        setTimeout(() => {
          if (navigationRef.current) {
            navigationRef.current.navigate('POIDetails', { poiId });
          }
        }, 500);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Provider theme={theme}>
      <NotificationsProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.white}
        />
        <NavigationContainer
          ref={navigationRef}
          linking={linking}
          onReady={() => {
            // Process any pending deep link when navigation becomes ready
            if (pendingDeepLinkUrl) {
              handleDeepLinkNavigation(pendingDeepLinkUrl);
              pendingDeepLinkUrl = null;
            }
          }}>
          <Screens />
        </NavigationContainer>
      </NotificationsProvider>
    </Provider>
  );
};

const Wrapper = __DEV__ ? App : Sentry.wrap(App);

export default Wrapper;
