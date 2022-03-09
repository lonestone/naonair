import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { POI, poiIcons } from '../../actions/poi';
import { fonts, theme } from '../../theme';
import { StackNavigationScreenProp } from '../../types/routes';
import ARQAChip from '../atoms/ARQAChip';
import ARListItem from '../molecules/ARListItem';

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
});

interface ARListViewProps {
  pois: POI[];
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
      onPress={() => navigation.navigate('POIDetails', { poi })}
      leftIcon={() => (
        <View style={styles.chipWrapper}>
          <SvgXml
            width="20"
            height="20"
            xml={poiIcons[poi.category] || null}
            fill="#25244E"
          />
        </View>
      )}
      rightChip={
        <View style={styles.chipWrapper}>
          <ARQAChip coord={poi.geolocation} size="xs" />
        </View>
      }
    />
  );
};

const ARListView = ({ pois }: ARListViewProps) => {
  const navigation = useNavigation<StackNavigationScreenProp>();

  return (
    <FlatList
      data={pois}
      keyExtractor={item => `poi-${item.id}`}
      renderItem={({ item }) => <Item poi={item} navigation={navigation} />}
    />
  );
};

export default ARListView;
