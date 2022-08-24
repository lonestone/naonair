import React from 'react';
import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { poiIcons } from '../../actions/poi';

export type FavoriteButtonProps = Omit<
  ComponentProps<typeof IconButton>,
  'icon' | 'style'
> & {
  isFavorited?: boolean;
};

const styles = StyleSheet.create({
  favoriteButton: {
    padding: 0,
    margin: 0,
    marginTop: 3,
    marginRight: 10,
    flex: 0,
  },
});

const FavoriteButton = ({ isFavorited, ...props }: FavoriteButtonProps) => {
  return (
    <IconButton
      icon={() => (
        <SvgXml
          width="20"
          height="20"
          xml={poiIcons.favorite!}
          fill={isFavorited ? '#25244E' : 'white'}
        />
      )}
      style={styles.favoriteButton}
      {...props}
    />
  );
};

export default FavoriteButton;
