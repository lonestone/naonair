/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {ThemeProvider} from 'react-native-paper';
import {NewsDialog} from './components/templates/NewsDialog';
import Screens from './Screens';
import {theme} from './theme';

const styles = StyleSheet.create({});

const App = () => {
  const [visible, setVisible] = React.useState(false);
  const isDarkMode = false; // useColorScheme() === 'dark';

  console.log('visible', visible);

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Screens />
      {visible && (
        <NewsDialog visible={visible} onClose={() => setVisible(false)} />
      )}
    </ThemeProvider>
  );
};

export default App;
