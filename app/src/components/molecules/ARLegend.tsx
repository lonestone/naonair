import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { Card, Headline, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme';
import { legendItems } from '../../types/legends';
import ARQAChip from '../atoms/ARQAChip';

export interface ARLegendProps extends ViewProps {}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
  },
  closeContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default (props: ViewProps) => {
  const [isDeployed, setDeployed] = useState(false);

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
            {legendItems.map((item, index) => (
              <ARQAChip key={`legend-${index}`} item={item} />
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
