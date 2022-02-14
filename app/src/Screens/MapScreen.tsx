import React, {ReactElement, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Caption, Headline} from 'react-native-paper';
import {getAll} from '../actions/poi';
import Header from '../components/molecules/ARHeader';
import MapView from '../components/molecules/ARMapView';
import SwitchToggle, {
  SwitchToggleItem,
} from '../components/molecules/ARSwitchToggle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headlineContainer: {
    flexDirection: 'row',
  },
  headline: {
    flex: 1,
    alignItems: 'stretch',
  },
});

const displayTypeItems: (SwitchToggleItem & {render: () => ReactElement})[] = [
  {
    key: 'map',
    icon: 'map',
    render: () => <MapView />,
  },
  {
    key: 'list',
    icon: 'list',
    render: () => <View />,
  },
];

export default () => {
  const [displayTypeIndex, setDisplayTypeIndex] = useState(0);

  const pois = getAll();
  console.log({pois});

  return (
    <>
      <Header>
        <SafeAreaView>
          <View style={styles.headlineContainer}>
            <Headline style={styles.headline}>Les points d'intérêts</Headline>
            <SwitchToggle
              onChange={setDisplayTypeIndex}
              activeIndex={displayTypeIndex}
              items={displayTypeItems}
              activeColor="#4863f1"
            />
          </View>

          <Caption>Découvrez la qualité de l'air en temps réel</Caption>
        </SafeAreaView>
      </Header>
      <SafeAreaView style={styles.container}>
        {displayTypeItems[displayTypeIndex].render()}
      </SafeAreaView>
    </>
  );
};
