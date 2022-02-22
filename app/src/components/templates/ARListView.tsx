import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { POI } from '../../actions/poi';
import { theme } from '../../theme';
import { NavigationScreenProp } from '../../types/routes';
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
});

interface ARListViewProps {
  pois: POI[];
}

const ARListView = ({ pois }: ARListViewProps) => {
  const navigation = useNavigation<NavigationScreenProp>();

  const poiQA = {
    label: 'dégradé',
    color: theme.colors.quality.yellow,
    labelColor: '#8D8500',
  };

  return (
    <View>
      {pois.map((poi, idx) => (
        <ARListItem
          key={idx}
          title={poi.name}
          description={poi.adress}
          descriptionStyle={styles.description}
          titleStyle={styles.title}
          onPress={() => {
            navigation.navigate('Details', {
              poiDetails: poi,
            });
          }}
          leftIcon={
            <SvgXml width="20" height="20" xml={icons[`${poi.category}`]} />
          }
          rightIcon={
            <View style={{ justifyContent: 'center' }}>
              <ARQAChip size="sm" item={poiQA} />
            </View>
          }
        />
      ))}
    </View>
  );
};

export default ARListView;
