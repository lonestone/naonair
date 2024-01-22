import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '../../theme';
import ARSwitch from '../atoms/ARSwitch';

interface ARNotificationRowProps {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  loading: boolean;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    ...fonts.Lato.regular,
  },
});

const ARNotificationRow = ({
  name,
  value,
  onChange,
  loading,
}: ARNotificationRowProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
      <ARSwitch onChange={onChange} value={value} loading={loading} />
    </View>
  );
};

export default ARNotificationRow;
