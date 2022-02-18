import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
  name: {
    fontWeight: 'bold',
    color: theme.colors.blue[500],
  },
  address: {
    color: theme.colors.blue[300],
    lineHeight: 24,
  },
});

interface ARListItemProps {
  poi: POI;
  isList?: boolean;
  marginBottom?: number;
  onPress?: (poi: POI) => void;
  fontSizeTitle?: any;
  fontSizeDescription?: any;
}

export type NavigationScreenProp = StackNavigationProp<any, 'Details'>;

const ARListItem = ({
  isList,
  onPress,
  poi,
  marginBottom,
  fontSizeTitle,
  fontSizeDescription,
}: ARListItemProps) => {
  return (
    <>
      <View style={{ marginBottom }}>
        <List.Item
          title={poi.name}
          titleStyle={[
            styles.name,
            fontSizeTitle && { fontSize: fontSizeTitle },
          ]}
          description={poi.adress}
          onPress={() => onPress && onPress(poi)}
          descriptionStyle={[
            styles.address,
            fontSizeDescription && { fontSize: fontSizeDescription },
          ]}
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
              <ARQAChip
                item={{
                  label: 'dégradé',
                  color: theme.colors.quality.yellow,
                  labelColor: '#8D8500',
                }}
              />
            )
          }
        />
      </View>
      <Divider />
    </>
  );
};

export default ARListItem;
