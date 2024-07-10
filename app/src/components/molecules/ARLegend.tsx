import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { QAValues } from '../../actions/qa';
import { fonts, theme } from '@theme';
import ARQAChip from '../atoms/ARQAChip';

export interface ARLegendProps extends ViewProps {}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  deployedContainer: {
    borderRadius: 16,
    padding: 24,
    paddingBottom: 0,
    paddingRight: 0,
    width: 190,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  closeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  chipsContainer: {
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingBottom: 10,
  },
  closedIcon: {
    marginRight: 7,
  },
  text: {
    ...fonts.Lato.semibold,
    fontSize: 14,
  },
  closeText: {
    marginLeft: 10,
  },

  headline: {
    ...fonts.Lato.bold,
    fontSize: 16,
    lineHeight: 24,
  },
});

export interface ARLegendProps extends ViewProps {
  isDeployed: boolean;
  onToggle: () => void;
}

export default (props: ARLegendProps) => {
  return (
    <Surface
      {...props}
      style={StyleSheet.flatten([
        props.isDeployed ? styles.deployedContainer : styles.container,
        props.style,
      ])}>
      {!props.isDeployed ? (
        <TouchableOpacity onPress={props.onToggle}>
          <View style={styles.buttonContainer}>
            <Icon
              name="help"
              size={20}
              color={theme.colors.blue[500]}
              style={styles.closedIcon}
            />
            <Text style={styles.text}>Légende</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View>
          <Text style={styles.headline}>Qualité de l'air</Text>
          <View style={styles.chipsContainer}>
            {Object.values(QAValues)
              .reverse()
              .map((value, index) => (
                <ARQAChip size="xs" key={`legend-${index}`} value={value} />
              ))}
          </View>

          <TouchableOpacity onPress={props.onToggle}>
            <View style={[styles.buttonContainer, styles.closeContainer]}>
              <Icon name="clear" size={20} color={theme.colors.blue[500]} />
              <Text style={[styles.text, styles.closeText]}>Fermer</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </Surface>
  );
};
