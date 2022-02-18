import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { POI } from '../../actions/poi';
import { theme } from '../../theme';
import { icons } from '../templates/ARMapView';

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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.blue[500],
  },
  address: {
    fontSize: 16,
    color: theme.colors.blue[300],
    lineHeight: 24,
  },
});

interface ARListItemProps {
  poi: POI;
  withIcon?: boolean;
  marginBottom?: number;
}

export type NavigationScreenProp = StackNavigationProp<any, 'Details'>;

const ARListItem = ({poi, withIcon, marginBottom}: ARListItemProps) => {
  const navigation = useNavigation<NavigationScreenProp>();

  return (
    <>
      <View style={{marginBottom}}>
        <List.Item
          title={poi.name}
          titleStyle={styles.name}
          descriptionStyle={styles.address}
          description={poi.adress}
          onPress={() =>
            navigation.navigate('Details', {
              poiDetails: poi,
            })
          }
          left={props =>
            withIcon && (
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
            )
          }
          // right={props => }
        />
      </View>
      <Divider />
    </>
  );
};

export default ARListItem;
