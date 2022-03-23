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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { SafeAreaView } from 'react-native-safe-area-context';
import ARMapCrawler from './components/molecules/ARMapCrawler';
import ARAlert from './components/templates/ARAlert';
import ARNews from './components/templates/ARNews';
import { SENTRY } from './config.json';
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
        <SafeAreaProvider>
          <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <ARMapCrawler />
          </SafeAreaView>
        </SafeAreaProvider>
        {/* <Screens /> */}
      </NavigationContainer>
    </Provider>
  );
};

const Wrapper = __DEV__ ? App : Sentry.wrap(App);

export default Wrapper;
