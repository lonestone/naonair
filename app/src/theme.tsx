import { DefaultTheme } from 'react-native-paper';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      outlineDisabled: string;
    }

    interface Theme {}
  }
}

export const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: '#4863F1',
    accent: '#EDEFFE',
    white: 'white',
    outlineDisabled: '#9BA4D1',
    outlineFocused: '#4863F1',
    black: {
      500: '#13395F',
    },
    blue: {
      50: '#F1F0F9',
      100: '#EDEFFE',
      300: '#8382A6',
      400: '#9BA4D1',
      500: '#25244E',
    },
    quality: {
      purple: '#7D2081',
      darkRed: '#960032',
      red: '#FF5050',
      yellow: '#F0E641',
      green: '#51CCA9',
      cyan: '#26D1C7',
    },
  },
};
