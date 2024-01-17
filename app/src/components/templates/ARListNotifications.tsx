import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';
import {
  PollenSettings,
  getPollenSettings,
  savePollenSettings,
} from '../../actions/pollen';
import { useNotifications } from '../../hooks/useNotifications';
import ARSnackbar from '../atoms/ARSnackbar';
import ARSwitch from '../atoms/ARSwitch';
import BackButton from '../molecules/ARBackButton';
import ARCommonHeader from '../molecules/ARCommonHeader';

const ARListNotifications = () => {
  const { getFcmToken } = useNotifications();
  const [pollenSpecies, setPollenSpecies] = useState<PollenSettings[] | null>(
    null,
  );
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <View>
        {pollenSpecies !== null && (
          <FlatList
            keyExtractor={item => item.name}
            data={pollenSpecies}
            renderItem={({ item }) => (
              <>
                <Text>{item.name}</Text>
                <ARSwitch
                  onChange={(value: boolean) =>
                    setPollenValue({ name: item.name, value })
                  }
                  value={item.value}
                  loading={loading}
                />
              </>
            )}
          />
        )}
      </View>
    </>
  );
};

export default ARListNotifications;
