module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.svg'],
      },
    ],
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src',
          '@atoms': './src/components/atoms',
          '@organisms': './src/components/organisms',
          '@molecules': './src/components/molecules',
          '@templates': './src/components/templates',
          '@type': './src/types',
          '@assets': './src/assets',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
        },
      },
    ],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
