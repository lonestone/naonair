import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  PollenSettings,
  getPollenSettings,
  savePollenSettings,
} from '../../actions/pollen';
import { useNotifications } from '../../hooks/useNotifications';
import ARSnackbar from '../atoms/ARSnackbar';
import BackButton from '../molecules/ARBackButton';
import ARCommonHeader from '../molecules/ARCommonHeader';
import ARListPollenGroup from '../organisms/ARListPollenGroup';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1 },
});

const ARListNotifications = () => {
  const [pollenSpecies, setPollenSpecies] = useState<PollenSettings[] | null>(
    null,
  );
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pollenGroups, setPollenGroups] = useState<string[]>([]);

  const { getFcmToken } = useNotifications();

  useEffect(() => {
    if (pollenSpecies) {
      const uniqueGroupsSet = new Set<string>();
      pollenSpecies.forEach(pollen => {
        uniqueGroupsSet.add(pollen.group);
      });
      setPollenGroups(Array.from(uniqueGroupsSet));
    }
  }, [pollenSpecies]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      return await getFcmToken();
    })().then(setFcmToken);

    getPollenSettings(fcmToken)
      .then(setPollenSpecies)
      .finally(() => {
        setLoading(false);
      });
  }, [fcmToken]);

  const setPollenValue = (pollen: PollenSettings) => {
    if (!pollenSpecies || !fcmToken) {
      return;
    }
    setLoading(true);
    savePollenSettings(pollen, fcmToken)
      .then(setPollenSpecies)
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <ARCommonHeader
        headline="Mes Notifications"
        left={<BackButton />}
        caption="Retrouvez ici la gestion de vos alertes"
      />
      <ARSnackbar />
      <SafeAreaView style={styles.container}>
        {loading && <ActivityIndicator />}
        <ScrollView>
          {pollenSpecies &&
            pollenGroups.map(group => (
              <ARListPollenGroup
                pollens={pollenSpecies}
                groupName={group}
                setPollenValue={setPollenValue}
                loading={loading}
              />
            ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ARListNotifications;
