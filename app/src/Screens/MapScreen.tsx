import { createStackNavigator } from '@react-navigation/stack';
import React, { ReactElement, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { getAll, POICategory } from '../actions/poi';
import ARPOIHeader from '../components/molecules/ARPOIHeader';
import { SwitchToggleItem } from '../components/molecules/ARSwitchToggle';
import ARListView from '../components/templates/ARListView';
import ARMapView from '../components/templates/ARMapView';
import ARPOIDetails from '../components/templates/ARPOIDetails';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default () => {
  const [displayTypeIndex, setDisplayTypeIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<POICategory[]>(
    [],
  );
  const Stack = createStackNavigator();

  const pois = getAll(selectedCategories);

  const displayTypeItems: (SwitchToggleItem & {render: () => ReactElement})[] =
    [
      {
        key: 'map',
        icon: 'map',
        render: () => (
          <Stack.Screen name="Map">
            {() => <ARMapView pois={pois} />}
          </Stack.Screen>
        ),
      },
      {
        key: 'list',
        icon: 'list',
        render: () => (
          <Stack.Screen name="List">
            {() => <ARListView pois={pois} />}
          </Stack.Screen>
        ),
      },
    ];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator
          screenOptions={{cardStyle: {backgroundColor: 'white'}}}>
          <Stack.Group
            screenOptions={{
              header: () => (
                <ARPOIHeader
                  displayTypeIndex={displayTypeIndex}
                  displayTypeItems={displayTypeItems}
                  setDisplayTypeIndex={setDisplayTypeIndex}
                  setSelectedCategories={setSelectedCategories}
                />
              ),
            }}>
            {displayTypeItems[displayTypeIndex].render()}
          </Stack.Group>
          <Stack.Screen
            name="Details"
            component={ARPOIDetails}
            options={{headerTitle: 'Détail'}}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </>
  );
};
