import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { POI } from '../../actions/poi';
import { theme } from '../../theme';
import { NavigationScreenProp } from '../../types/routes';
import ARQAChip from '../atoms/ARQAChip';
import ARListItem from '../molecules/ARListItem';
import { icons } from './ARMapView';

const styles = StyleSheet.create({
  description: {
    color: theme.colors.blue[300],
    lineHeight: 24,
    fontSize: 12,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.blue[500],
    fontSize: 16,
  },
  chipWrapper: {
    justifyContent: 'center',
  },
});

interface ARListViewProps {
  pois: POI[];
}

const ARListView = ({ pois }: ARListViewProps) => {
  const navigation = useNavigation<NavigationScreenProp>();

  return (
    <ScrollView>
      {pois.map((poi, idx) => (
        <ARListItem
          key={idx}
          title={poi.name}
          description={poi.adress}
          descriptionStyle={styles.description}
          titleStyle={styles.title}
          onPress={() =>
            navigation.navigate('Details', {
              poiDetails: poi,
            })
          }
          leftIcon={() => (
            <SvgXml
              width="20"
              height="20"
              xml={icons[`${poi.category}`]}
              fill="#25244E"
            />
          )}
          rightChip={
            <View style={styles.chipWrapper}>
              <ARQAChip coord={poi.geolocation} size="sm" />
            </View>
          }
        />
      ))}
    </ScrollView>
  );
};

export default ARListView;
