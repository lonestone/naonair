import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { POI } from '../../actions/poi';
import { theme } from '../../theme';
import ARListItem, { NavigationScreenProp } from '../molecules/ARListItem';

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

  return (
    <View>
      {pois.map((poi, idx) => (
        <ARListItem
          key={idx}
          isList
          poi={poi}
          descriptionStyle={styles.description}
          titleStyle={styles.title}
          onPress={() => {
            navigation.navigate('Details', {
              poiDetails: poi,
            });
          }}
        />
      ))}
    </View>
  );
};

export default ARListView;
