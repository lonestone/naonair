import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import slugify from 'slugify';
import { ARParcours } from '../../actions/parcours';
import { QATypes, QAValues } from '../../actions/qa';
import { useQAParcours } from '../../hooks/useQA';
import { fonts, theme } from '../../theme';
import { StackNavigationScreenProp } from '../../types/routes';
import ARQAChip from '../atoms/ARQAChip';

const styles = StyleSheet.create({
  card: { elevation: 4, margin: 10 },
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  mapContainer: {
    height: 160,
    overflow: 'hidden',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  headline: {
    ...fonts.Lato.bold,
    color: theme.colors.blue[500],
    fontSize: 16,
    lineHeight: 24,
  },
  distance: {
    ...fonts.Lato.regular,
    color: theme.colors.blue[300],
    fontSize: 12,
    lineHeight: 16,
  },
  icons: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
});

export interface ARRouteItemProps extends ViewProps {
  parcours: ARParcours;
}

export default ({ style, parcours }: ARRouteItemProps) => {
  const navigation = useNavigation<StackNavigationScreenProp>();

  const { properties } = parcours;

  const qa = useQAParcours(parcours);

  const { coureur, marcheur, cycliste, km, denivele, nom } = properties;

  const imageName = slugify(properties.nom, {
    lower: true,
    replacement: '_',
    remove: /[*+~.()'"!:@]/g,
  });

  return (
    <Card
      style={[style, styles.card]}
      onPress={() => {
        navigation.navigate('RouteDetail', { parcours, qa });
      }}>
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: imageName,
          }}
          // source={
          //   !!properties?.nom &&
          //   require(`../../assets/parcours/Foulées de l'éléphant.png`)
          // }
          style={{ backgroundColor: theme.colors.blue[100], flex: 1 }}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.headline}>{nom}</Text>
        <Text style={styles.distance}>{`${km}Km - dénivelé ${denivele}m`}</Text>

        <View style={styles.icons}>
          {[coureur && 'run', marcheur && 'walk', cycliste && 'bike'].map(
            icon =>
              icon && (
                <Icon
                  key={`icon-${icon}`}
                  size={20}
                  color={theme.colors.blue[500]}
                  name={icon}
                />
              ),
          )}

          <View style={styles.spacer} />
          <ARQAChip size="md" value={QAValues[qa ?? QATypes.XXBAD]} />
        </View>
      </View>
    </Card>
  );
};
