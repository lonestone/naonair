import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fonts } from '../../theme';

import { PollenDTO } from '@aireal/dtos';
import { getPollen, getPollenStates } from '../../actions/pollen';
import { useOnForegroundFocus } from '../../hooks/useOnForgroundFocus';
import ARPollenStateRow from '../molecules/ARPollenStateRow';

const defaultState = (state: number) => {
  if (state <= 0) {
    return "Pas d'émission";
  } else {
    return 'Émission';
  }
};

type PollenRow = { pollen: PollenDTO; stateName: string };
type PollenSection = {
  title: string;
  data: PollenRow[];
};

const ARListPollens = () => {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<Record<number, string>>();
  const [pollens, setPollens] = useState<PollenDTO[]>([]);

  useOnForegroundFocus(() => {
    updatePollenNotifications();
  }, true);

  useEffect(() => {
    updatePollenNotifications();
  }, []);

  const updatePollenNotifications = () => {
    setLoading(true);
    Promise.all([getPollenStates(), getPollen()])
      .then(([statesResponse, pollensResponse]) => {
        setLoading(false);
        setStates(statesResponse);
        setPollens(pollensResponse);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const sectionsPollen = useMemo<PollenSection[]>(() => {
    const namedStatePollens: PollenRow[] = pollens.map(pollen => {
      return {
        pollen,
        stateName: states?.[pollen.state] || defaultState(pollen.state),
      };
    });

    return namedStatePollens.reduce((acc, item) => {
      const existingGroup = acc.find(
        section => section.title === item.pollen.group,
      );

      if (existingGroup) {
        existingGroup.data.push(item);
      } else {
        acc.push({ title: item.pollen.group, data: [item] });
      }

      return acc;
    }, [] as PollenSection[]);
  }, [states, pollens]);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <SectionList
          sections={sectionsPollen}
          keyExtractor={item => item.pollen.name}
          contentContainerStyle={{ paddingLeft: 24 }}
          stickySectionHeadersEnabled={false}
          renderItem={({ item: { pollen, stateName } }) => (
            <ARPollenStateRow pollen={pollen} stateName={stateName} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    ...fonts.Raleway.bold,
    fontSize: 20,
    lineHeight: 24,
  },
  sectionTitleContainer: {
    marginTop: 42,
    marginBottom: 8,
  },
});

export default ARListPollens;
