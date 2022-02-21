import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { Divider, List } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { POI } from '../../actions/poi';
import { theme } from '../../theme';
import ARQAChip from '../atoms/ARQAChip';
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
});

interface ARListItemProps {
  poi: POI;
  isList?: boolean;
  marginBottom?: number;
  onPress?: (poi: POI) => void;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

export type NavigationScreenProp = StackNavigationProp<any, 'Details'>;

const ARListItem = ({
  isList,
  onPress,
  poi,
  marginBottom,
  titleStyle,
  descriptionStyle,
}: ARListItemProps) => {
  const poiQA = {
    label: 'dégradé',
    color: theme.colors.quality.yellow,
    labelColor: '#8D8500',
  };

  return (
    <>
      <View style={{ marginBottom }}>
        <List.Item
          title={poi.name}
          titleStyle={titleStyle}
          description={poi.adress}
          onPress={() => onPress && onPress(poi)}
          descriptionStyle={descriptionStyle}
          left={props =>
            isList && (
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
          right={() =>
            isList && (
              <View style={{ justifyContent: 'center' }}>
                <ARQAChip size="sm" item={poiQA} />
              </View>
            )
          }
        />
      </View>
      <Divider />
    </>
  );
};

export default ARListItem;
