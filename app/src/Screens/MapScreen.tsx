import React, {ReactElement, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {getAll, POICategory} from '../actions/poi';
import ARPOIHeader from '../components/molecules/ARPOIHeader';
import {SwitchToggleItem} from '../components/molecules/ARSwitchToggle';
import ARListView from '../components/templates/ARListView';
import ARMapView from '../components/templates/ARMapView';

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

  const pois = getAll(selectedCategories);

  const displayTypeItems: (SwitchToggleItem & {render: () => ReactElement})[] =
    [
      {
        key: 'map',
        icon: 'map',
        render: () => <ARMapView pois={pois} />,
      },
      {
        key: 'list',
        icon: 'list',
        render: () => <ARListView pois={pois} />,
      },
    ];

  return (
    <>
      <ARPOIHeader
        displayTypeIndex={displayTypeIndex}
        displayTypeItems={displayTypeItems}
        setDisplayTypeIndex={setDisplayTypeIndex}
        setSelectedCategories={setSelectedCategories}
      />
      <SafeAreaView style={styles.container}>
        {displayTypeItems[displayTypeIndex].render()}
      </SafeAreaView>
    </>
  );
};
