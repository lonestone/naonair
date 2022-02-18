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
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'react-native-paper';
import Screens from './Screens';
import {theme} from './theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        <Screens />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
