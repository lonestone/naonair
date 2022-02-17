import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
  poi: POI;
}

export type NavigationScreenProp = NativeStackNavigationProp<any, "Details">;

const ARListItem = ({poi}: ARListItemProps) => {
  const navigation = useNavigation<NavigationScreenProp>()

  return (
    <>
      <Divider />
      <View>
        <List.Item
          title={poi.name}
          descriptionStyle={styles.description}
          description={poi.adress}
          onPress={() =>
            navigation.navigate('Details', {
              poiDetails: poi,
            })
          }
          left={props => (
            <List.Icon
              {...props}
              style={styles.iconContainer}
              icon={() => (
                <SvgXml
                  width="20"
                  height="20"
                  xml={icons[`${poi.category}`]}
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
