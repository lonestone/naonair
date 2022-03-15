import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../theme';
import logger from '../../utils/logger';

type ARLinkType = {
  label: string;
  url: string;
};

const styles = StyleSheet.create({
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
    fontSize: 14,
  },
});

export const ARLink = ({ label, url }: ARLinkType) => {
  const handlePress = async () => {
    try {
      Linking.openURL(url);
    } catch (e) {
      logger.error(e, 'from openUrl');
    }
  };

  return (
    <TouchableOpacity>
      <View>
        <Text style={styles.link} onPress={() => handlePress()}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
