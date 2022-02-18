import React from 'react';
import {View} from 'react-native';
import {POI} from '../../actions/poi';
import ARListItem from '../molecules/ARListItem';

interface ARListViewProps {
  pois: POI[];
}

const ARListView = ({pois}: ARListViewProps) => {
  return (
    <View>
      {pois.map((poi, idx) => (
        <ARListItem key={idx} poi={poi} withIcon />
      ))}
    </View>
  );
};

export default ARListView;
