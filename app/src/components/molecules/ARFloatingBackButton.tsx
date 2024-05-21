import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationScreenProp } from '../../types/routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme';
import { Pressable, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backButtonSafeArea: {
    position: 'absolute',
    paddingLeft: 16,
    paddingTop: 16,
    zIndex: 2,
  },
  backButtonContainer: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 50,
  },
});

export default () => {
  const navigation = useNavigation<StackNavigationScreenProp>();

  return (
    <SafeAreaView style={styles.backButtonSafeArea}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <Surface style={styles.backButtonContainer}>
          <Icon name="arrow-left" size={16} color={theme.colors.white} />
        </Surface>
      </Pressable>
    </SafeAreaView>
  );
};
