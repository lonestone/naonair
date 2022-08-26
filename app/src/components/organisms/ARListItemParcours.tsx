import React from 'react';
import { ARParcours } from '../../actions/parcours';
import ARListItem, { ARListItemProps } from '../molecules/ARListItem';

export type ListItemPOIProps = {
  parcours: ARParcours;
  onPress: () => void;
  titleStyle: ARListItemProps['titleStyle'];
  descriptionStyle: ARListItemProps['descriptionStyle'];
};

const ListItemPOI = ({
  parcours,
  onPress,
  titleStyle,
  descriptionStyle,
}: ListItemPOIProps) => {
  return (
    <ARListItem
      key={`parcours-${parcours.properties.id}`}
      title={parcours.properties.nom}
      descriptionStyle={descriptionStyle}
      titleStyle={titleStyle}
      onPress={onPress}
      rightIcon="delete"
    />
  );
};

export default ListItemPOI;
