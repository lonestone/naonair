import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Headline } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { POICategory, poiIcons } from '../../actions/poi';
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
  },
});

const filters: ARFilterItem[] = [
  {
    label: 'Mes favoris',
    value: POICategory.FAVORITE,
    icon: selected => (
      <CommunityIcon
        size={20}
        color={selected ? 'white' : theme.colors.blue[500]}
        name="star"
      />
    ),
  },
  {
    label: 'Parcs',
    value: POICategory.PARK,
    icon: selected => (
      <SvgXml
        width={20}
        height={20}
        fill={selected ? 'white' : theme.colors.blue[500]}
        xml={poiIcons[POICategory.PARK] || null}
      />
    ),
  },
  {
    label: 'Sport',
    value: POICategory.SPORT,
    icon: selected => (
      <SvgXml
        width={20}
        height={20}
        fill={selected ? 'white' : theme.colors.blue[500]}
        xml={poiIcons[POICategory.SPORT] || null}
      />
    ),
  },
  {
    label: 'Culture',
    value: POICategory.CULTURE,
    icon: selected => (
      <SvgXml
        width={20}
        height={20}
        fill={selected ? 'white' : theme.colors.blue[500]}
        xml={poiIcons[POICategory.CULTURE] || null}
      />
    ),
  },
  {
    label: 'Marché',
    value: POICategory.MARKET,
    icon: selected => (
      <SvgXml
        width={20}
        height={20}
        fill={selected ? 'white' : theme.colors.blue[500]}
        xml={poiIcons[POICategory.MARKET] || null}
      />
    ),
  },
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
