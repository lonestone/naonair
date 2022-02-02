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
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import {Button, ThemeProvider} from 'react-native-paper';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {NewsDialog} from './components/templates/NewsDialog';
import {theme} from './theme';

const App = () => {
  const [visible, setVisible] = React.useState(true);
  const isDarkMode = false; // useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: '100%',
  };

  console.log('visible', visible);

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          {/* <Header /> */}
          <View>
            <Button onPress={() => setVisible(true)}>Show news</Button>
          </View>
        </ScrollView>
        {visible && (
          <NewsDialog visible={visible} onClose={() => setVisible(false)} />
        )}
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default App;
