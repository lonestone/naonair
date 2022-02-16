import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native';
import {Card, Headline, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../theme';

export interface ARLegendProps extends ViewProps {}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
  },
  chip: {
    flex: 0,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 5,
  },
  chipLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  closeContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

interface LegendItem {
  label: string;
  color: string;
  labelColor: string;
}

const items: LegendItem[] = [
  {
    label: 'extrêm. mauvais',
    color: theme.colors.quality.purple,
    labelColor: '#FEF0FF',
  },
  {
    label: 'très mauvais',
    color: theme.colors.quality.darkRed,
    labelColor: '#FFEAF4',
  },
  {
    label: 'mauvais',
    color: theme.colors.quality.red,
    labelColor: '#FFEBEB',
  },
  {
    label: 'dégradé',
    color: theme.colors.quality.yellow,
    labelColor: '#8D8500',
  },
  {
    label: 'moyen',
    color: theme.colors.quality.green,
    labelColor: '#E9FAF5',
  },
  {
    label: 'bon',
    color: theme.colors.quality.cyan,
    labelColor: '#EEFFFE',
  },
];

export default (props: ViewProps) => {
  const [isDeployed, setDeployed] = useState(false);

  const styleChip = (item: LegendItem) => {
    return StyleSheet.flatten([styles.chip, {backgroundColor: item.color}]);
  };

  return (
    <Card
      {...props}
      style={StyleSheet.flatten([styles.container, props.style])}>
      <Card.Content>
        {!isDeployed ? (
          <TouchableOpacity onPress={() => setDeployed(true)}>
            <View style={styles.closeContainer}>
              <Icon name="help" size={20} color={theme.colors.blue[500]} />
              <Text>Légende</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View>
            <Headline>Qualité de l'air</Headline>
            {items.map((item, index) => (
              <View key={`legend-${index}`} style={styleChip(item)}>
                <Text style={styles.chipLabel}>{item.label}</Text>
              </View>
            ))}

            <TouchableOpacity onPress={() => setDeployed(false)}>
              <View style={styles.closeContainer}>
                <Icon name="clear" size={20} color={theme.colors.blue[500]} />
                <Text>Fermer</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};
