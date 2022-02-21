import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ARMap from '../atoms/ARMap';
import { NavigationScreenProp } from '../molecules/ARListItem';

export default () => {
  const navigation = useNavigation<NavigationScreenProp>();

  return (
    <>
      <ARMap userLocationVisible interactionEnabled heatmapVisible></ARMap>
      <SafeAreaView style={{ position: 'absolute' }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <View style={{ backgroundColor: 'white' }}>
            <Text>BACK</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </>

    // </View>
  );
};
