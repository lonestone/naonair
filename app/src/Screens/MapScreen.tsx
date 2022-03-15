import React, { ReactElement, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { getAll, POI, POICategory } from '../actions/poi';
import { SwitchToggleItem } from '../components/molecules/ARSwitchToggle';
import ARPOIHeader from '../components/organisms/ARPOIHeader';
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
  const [pois, setPois] = useState<POI[]>([]);

  const generateListOfPOIs = async (categories: POICategory[]) => {
    const _pois = await getAll({ categories });
    setPois(_pois);
  };

  useEffect(() => {
    generateListOfPOIs(selectedCategories);
  }, [selectedCategories]);

  const displayTypeItems: (SwitchToggleItem & {
    render: () => ReactElement;
  })[] = [
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
