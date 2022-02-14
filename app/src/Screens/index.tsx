import React, {useState} from 'react';
import {BottomNavigation} from 'react-native-paper';
import MapScreen from './MapScreen';

export default () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([{key: 'map', title: 'Carte', icon: 'album'}]);

  const renderScene = BottomNavigation.SceneMap({
    map: () => <MapScreen />,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
