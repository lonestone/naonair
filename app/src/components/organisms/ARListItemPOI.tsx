import React from 'react';
import { POI, POICategory } from '../../actions/poi';
import ARListItem, { ARListItemProps } from '@molecules/ARListItem';

export type ListItemPOIProps = {
  poi: POI;
  onPress: () => void;
  titleStyle: ARListItemProps['titleStyle'];
  descriptionStyle: ARListItemProps['descriptionStyle'];
};

const ListItemPOI = ({
  poi,
  onPress,
  titleStyle,
  descriptionStyle,
}: ListItemPOIProps) => {
  return (
    <ARListItem
      key={`poi-${poi.id}`}
      title={poi.name}
      description={poi.address}
      descriptionStyle={descriptionStyle}
      titleStyle={titleStyle}
      onPress={onPress}
      category={poi.category}
      rightIcon={poi.category === POICategory.FAVORITE ? 'pencil' : 'delete'}
    />
  );
};

export default ListItemPOI;
