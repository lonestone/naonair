import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '@theme';

export interface ARBadgeProp {
  text: number;
}

const ARBadge = ({ text }: ARBadgeProp) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: -12,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: 'white',
    ...fonts.Lato.semibold,
    fontSize: 8,
  },
});

export default ARBadge;
