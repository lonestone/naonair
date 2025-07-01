import analytics from '@react-native-firebase/analytics';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import slugify from 'slugify';
import { ARParcours } from '../../actions/parcours';
import { QATypes, QAValues } from '../../actions/qa';
import { useQACustomParcours, useQAParcours } from '@hooks/useQA';
import { fonts, theme } from '@theme';
import { StackNavigationScreenProp } from '@type/routes';
import ARQAChip from '../atoms/ARQAChip';

const styles = StyleSheet.create({
  card: { elevation: 4, margin: 10, backgroundColor: 'white' },
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
    fontSize: 20,
    lineHeight: 24,
  },
  distance: {
    ...fonts.Lato.regular,
    color: theme.colors.blue[300],
    fontSize: 14,
    lineHeight: 24,
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
  customText: {
    color: theme.colors.blue[300],
  },
});

export interface ARRouteItemProps extends ViewProps {
  parcours: ARParcours;
}

export default ({ style, parcours }: ARRouteItemProps) => {
  const navigation = useNavigation<StackNavigationScreenProp>();

  const { properties } = parcours;

  const qa =
    parcours.type === 'Custom'
      ? useQACustomParcours(
          parcours.geometry.coordinates[0] as [number, number][],
        )
      : useQAParcours(parcours);

  const { coureur, marcheur, cycliste, km, denivele, nom } = properties;

  //console.log('imageUri', parcours.imageUri);

  return (
    <Card
      style={[style, styles.card]}
      onPress={async () => {
        await analytics().logEvent('selection_parcours', {
          name: nom,
        });
        navigation.navigate('RouteDetail', { parcours, qa });
      }}>
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: parcours.imageUri,
          }}
          style={{ backgroundColor: theme.colors.blue[100], flex: 1 }}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.headline}>{nom}</Text>
        <Text style={styles.distance}>
          {`${km.toFixed(2)}Km` + (denivele ? ` - ${denivele}m` : '')}
        </Text>

        <View style={styles.icons}>
          {parcours.type !== 'Custom' &&
            [coureur && 'run', marcheur && 'walk', cycliste && 'bike'].map(
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

          {parcours.type === 'Custom' && (
            <Text style={styles.customText}>Parcours personnalisé</Text>
          )}

          <View style={styles.spacer} />
          <ARQAChip size="md" value={QAValues[qa ?? QATypes.GOOD]} />
        </View>
      </View>
    </Card>
  );
};
