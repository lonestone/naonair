import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {POI} from '../../actions/poi';
import ARListItem, {NavigationScreenProp} from '../molecules/ARListItem';

interface ARListViewProps {
  pois: POI[];
}

const ARListView = ({pois}: ARListViewProps) => {
  const navigation = useNavigation<NavigationScreenProp>();

  return (
    <View>
      {pois.map((poi, idx) => (
        <ARListItem
          key={idx}
          poi={poi}
          withIcon
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
