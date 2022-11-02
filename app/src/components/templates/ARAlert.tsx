import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AlertDTO } from '@aireal/dtos';
import { getLastOne } from '../../actions/alerts';
import { theme } from '../../theme';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
  },
  text: {
    color: theme.colors.white,
    marginLeft: 12,
  },
});

export default () => {
  const [alert, setAlert] = useState<AlertDTO | null>(null);

  const getStyles = (_alert: AlertDTO) => {
    return {
      container: StyleSheet.flatten([
        styles.container,
        { backgroundColor: _alert.color },
      ]),
    };
  };

  useEffect(() => {
    getLastOne().then(setAlert);
  }, []);

  if (!alert) {
    return null;
  }

  const flattenStyles = getStyles(alert);

  return (
    <View style={flattenStyles.container}>
      <Icon name="information" size={20} color={theme.colors.white} />
      <Text style={styles.text}>{alert.seuil}</Text>
    </View>
  );
};
