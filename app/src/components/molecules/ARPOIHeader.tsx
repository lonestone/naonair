import React, {Dispatch, ReactElement, SetStateAction} from 'react';
import {StyleSheet, View} from 'react-native';
import {Caption, Headline} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {POICategory} from '../../actions/poi';
import {theme} from '../../theme';
import ARFilter, {ARFilterItem} from './ARFilter';
import ARHeader from '../atoms/ARHeader';
import ARSwitchToggle, {SwitchToggleItem} from './ARSwitchToggle';

const styles = StyleSheet.create({
  headlineContainer: {
    flexDirection: 'row',
  },
  headline: {
    flex: 1,
    alignItems: 'stretch',
  },
});

const filters: ARFilterItem[] = [
  {label: 'Mes favoris', value: POICategory.FAVORITE},
  {label: 'Parcs', value: POICategory.PARK},
  {label: 'Sport', value: POICategory.SPORT},
  {label: 'Culture', value: POICategory.CULTURE},
  {label: 'Marché', value: POICategory.MARKET},
];

interface Props {
  displayTypeItems: (SwitchToggleItem & {
    render: () => ReactElement;
  })[];
  displayTypeIndex: number;
  setSelectedCategories: Dispatch<SetStateAction<POICategory[]>>;
  setDisplayTypeIndex: Dispatch<SetStateAction<number>>;
}

const ARPOIHeader = ({
  displayTypeIndex,
  displayTypeItems,
  setDisplayTypeIndex,
  setSelectedCategories,
}: Props) => {
  return (
    <ARHeader>
      <SafeAreaView>
        <View style={styles.headlineContainer}>
          <Headline style={styles.headline}>Les points d'intérêts</Headline>
          <ARSwitchToggle
            onChange={setDisplayTypeIndex}
            activeIndex={displayTypeIndex}
            items={displayTypeItems}
            activeColor={theme.colors.primary}
          />
        </View>

        <Caption>Découvrez la qualité de l'air en temps réel</Caption>

        <ARFilter
          items={filters}
          multiple
          onChange={items => {
            setSelectedCategories(items.map(item => item.value));
          }}
        />
      </SafeAreaView>
    </ARHeader>
  );
};

export default ARPOIHeader;
