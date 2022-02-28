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
import React from 'react';
import * as Sentry from '@sentry/react-native';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-paper';
import Screens from './screens/NavigatorScreen';
import { theme } from './theme';
import { SENTRY } from './config.json';

if (!__DEV__) {
  Sentry.init({
    dsn: SENTRY.dsn,
  });
}

const App = () => {
  const jsx = (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        <Screens />
      </NavigationContainer>
    </ThemeProvider>
  );

  if (__DEV__) {
    return jsx;
  }

  return Sentry.wrap(() => jsx);
};

export default App;
