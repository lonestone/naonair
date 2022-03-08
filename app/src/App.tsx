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
import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-native-paper';
import ARAlert from './components/templates/ARAlert';
import ARNews from './components/templates/ARNews';
import { SENTRY } from './config.json';
import Screens from './Screens/NavigatorScreen';
import { theme } from './theme';

if (!__DEV__) {
  Sentry.init({
    dsn: SENTRY.dsn,
  });
}

const App = () => {
  return (
    <Provider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      <NavigationContainer>
        <Screens />
      </NavigationContainer>
      <ARAlert />
      <ARNews />
    </Provider>
  );
};

const Wrapper = __DEV__ ? App : Sentry.wrap(App);

export default Wrapper;
