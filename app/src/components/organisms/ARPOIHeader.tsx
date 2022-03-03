import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Headline } from 'react-native-paper';
import { POICategory } from '../../actions/poi';
import { fonts, theme } from '../../theme';
import ARHeader from '../atoms/ARHeader';
import ARFilter, { ARFilterItem } from '../molecules/ARFilter';
import ARSwitchToggle, { SwitchToggleItem } from '../molecules/ARSwitchToggle';

const styles = StyleSheet.create({
  headlineContainer: {
    flexDirection: 'row',
  },
  headline: {
    flex: 1,
    alignItems: 'stretch',
    fontSize: 20,
    color: theme.colors.blue[500],
    ...fonts.Raleway.bold,
  },
  caption: {
    ...fonts.Lato.regular,
    // letterSpacing: 1
  },
});

const filters: ARFilterItem[] = [
  { label: 'Mes favoris', value: POICategory.FAVORITE },
  { label: 'Parcs', value: POICategory.PARK },
  { label: 'Sport', value: POICategory.SPORT },
  { label: 'Culture', value: POICategory.CULTURE },
  { label: 'Marché', value: POICategory.MARKET },
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
      <>
        <View style={styles.headlineContainer}>
          <Headline style={styles.headline}>Les points d'intérêts</Headline>
          <ARSwitchToggle
            onChange={setDisplayTypeIndex}
            activeIndex={displayTypeIndex}
            items={displayTypeItems}
            activeColor={theme.colors.primary}
          />
        </View>

        <Caption style={styles.caption}>
          Découvrez la qualité de l'air en temps réel
        </Caption>

        <ARFilter
          items={filters}
          multiple
          onChange={items => {
            setSelectedCategories(items.map(item => item.value));
          }}
        />
      </>
    </ARHeader>
  );
};

export default ARPOIHeader;
