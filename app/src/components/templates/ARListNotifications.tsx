import React, { useEffect, useState } from 'react';
import { FlatList, Switch, View } from 'react-native';
import { Text } from 'react-native-paper';
import {
  PollenSettings,
  getPollenSettings,
  savePollenSettings,
} from '../../actions/pollen';
import ARSnackbar from '../atoms/ARSnackbar';
import BackButton from '../molecules/ARBackButton';
import ARCommonHeader from '../molecules/ARCommonHeader';

const ARListNotifications = () => {
  const [pollenSpecies, setPollenSpecies] = useState<PollenSettings[] | null>(
    null,
  );
  useEffect(() => {
    getPollenSettings().then(setPollenSpecies);
  }, []);

  const setPollenValue = (pollen: PollenSettings, value: boolean) => {
    if (!pollenSpecies) {
      return;
    }
    const updateSettings = pollenSpecies.map(setting =>
      setting.name === pollen.name ? { ...setting, value } : setting,
    );
    setPollenSpecies(updateSettings);
    savePollenSettings(updateSettings);
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
                <Switch
                  trackColor={{ false: '#B2B2C1', true: '#4863F1' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#B2B2C1"
                  onValueChange={(value: boolean) =>
                    setPollenValue(item, value)
                  }
                  value={item.value}
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
