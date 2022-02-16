import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Divider, List} from 'react-native-paper';
import {SvgXml} from 'react-native-svg';
import {POI} from '../../actions/poi';
import {theme} from '../../theme';
import {icons} from '../templates/ARMapView';

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.accent,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 12,
    color: theme.colors.blue[300],
  },
});

interface ARListItemProps {
  poiDetails: POI;
}

const ARListItem = ({poiDetails}: ARListItemProps) => {
  return (
    <>
      <Divider />
      <View>
        <List.Item
          title={poiDetails.name}
          descriptionStyle={styles.description}
          description={poiDetails.adress}
          onPress={() => console.log('POI', poiDetails)}
          left={props => (
            <List.Icon
              {...props}
              style={styles.iconContainer}
              icon={() => (
                <SvgXml
                  width="20"
                  height="20"
                  xml={icons[`${poiDetails.category}`]}
                />
              )}
            />
          )}
        />
      </View>
      <Divider />
    </>
  );
};

export default ARListItem;
