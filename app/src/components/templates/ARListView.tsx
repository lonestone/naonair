import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { POI } from '../../actions/poi';
import { theme } from '../../theme';
import { StackNavigationScreenProp } from '../../types/routes';
import ARQAChip from '../atoms/ARQAChip';
import ARListItem from '../molecules/ARListItem';
import { icons } from './ARMapView';

const styles = StyleSheet.create({
  description: {
    color: theme.colors.blue[300],
    lineHeight: 24,
    fontSize: 12,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.blue[500],
    fontSize: 16,
  },
  chipWrapper: {
    justifyContent: 'center',
  },
});

interface ARListViewProps {
  pois: POI[];
}

const Item = ({ poi }: { poi: POI }) => {
  const navigation = useNavigation<StackNavigationScreenProp>();

  return (
    <ARListItem
      title={poi.name}
      description={poi.adress}
      descriptionStyle={styles.description}
      titleStyle={styles.title}
      onPress={() =>
        navigation.navigate('POIDetails', {
          poiDetails: poi,
        })
      }
      leftIcon={() => (
        <View style={styles.chipWrapper}>
          <SvgXml
            width="20"
            height="20"
            xml={icons[`${poi.category}`]}
            fill="#25244E"
          />
        </View>
      )}
      rightChip={
        <View style={styles.chipWrapper}>
          <ARQAChip coord={poi.geolocation} size="sm" />
        </View>
      }
    />
  );
};

const ARListView = ({ pois }: ARListViewProps) => {
  return (
    <FlatList
      data={pois}
      keyExtractor={item => `poi-${item.id}`}
      renderItem={({ item }) => <Item poi={item} />}
    />
  );
};

export default ARListView;
