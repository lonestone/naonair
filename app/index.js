if (__DEV__) {
  import("./ReactotronConfig").then(() => console.info("Reactotron Configured"));
}
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);
