import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Paragraph } from 'react-native-paper';
import { POI, POICategory } from '../../actions/poi';
import { fonts, theme } from '@theme';
import { StackNavigationScreenProp } from '@type/routes';
import ARQAChip from '../atoms/ARQAChip';
import ARListItem from '@molecules/ARListItem';
import analytics from '@react-native-firebase/analytics';

const styles = StyleSheet.create({
  description: {
    color: theme.colors.blue[300],
    ...fonts.Lato.regular,
    fontSize: 12,
  },
  title: {
    ...fonts.Lato.medium,
    color: theme.colors.blue[500],
    fontSize: 16,
    lineHeight: 24,
  },
  chipWrapper: {
    justifyContent: 'center',
  },
  paragraph: {
    marginHorizontal: 20,
    marginTop: 10,
    color: theme.colors.blue[500],
  },
});

interface ARListViewProps {
  pois: POI[];
  category?: POICategory[];
}

const Item = ({
  poi,
  navigation,
}: {
  poi: POI;
  navigation: StackNavigationScreenProp;
}) => {
  return (
    <ARListItem
      title={poi.name}
      description={poi.address}
      descriptionStyle={styles.description}
      titleStyle={styles.title}
      onPress={async () => {
        await analytics().logEvent('selection_poi_depuis_liste', {
          name: poi.name,
          id: poi.id,
          address: poi.address,
        });

        navigation.navigate('POIDetails', { poi });
      }}
      category={poi.category}
      rightChip={
        <View style={styles.chipWrapper}>
          <ARQAChip coord={poi.geolocation} value={poi.qa} size="xs" />
        </View>
      }
    />
  );
};

const ARListView = ({ pois, category }: ARListViewProps) => {
  const navigation = useNavigation<StackNavigationScreenProp>();

  const handleNoFavorite = useMemo(() => {
    if (!pois.length && category![0] === POICategory.FAVORITE) {
      return (
        <View style={styles.paragraph}>
          <Paragraph>Vous n'avez aucun favoris.</Paragraph>
        </View>
      );
    } else {
      return (
        <FlatList
          data={pois}
          keyExtractor={item => `poi-${item.id}`}
          renderItem={({ item }) => <Item poi={item} navigation={navigation} />}
        />
      );
    }
  }, [category, navigation, pois]);

  return <>{handleNoFavorite}</>;
};

export default ARListView;
