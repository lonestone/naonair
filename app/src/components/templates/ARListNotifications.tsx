import { firebase } from '@react-native-firebase/messaging';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getIsFirstNotificationLaunched } from '../../actions/launch';
import {
  PollenSettings,
  getPollenSettings,
  savePollenSettings,
} from '../../actions/pollenNotifications';
import { NotificationsContext } from '../../contexts/notifications.context';
import { useNotifications } from '../../hooks/useNotifications';
import { useOnForegroundFocus } from '../../hooks/useOnForgroundFocus';
import { fonts, theme } from '../../theme';
import BackButton from '../molecules/ARBackButton';
import ARCommonHeader from '../molecules/ARCommonHeader';
import ARListPollenGroup from '../organisms/ARListPollenGroup';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1 },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.colors.errorContainer,
    padding: 10,
  },
  errorMessage: {
    ...fonts.Lato.semibold,
    fontSize: 15,
    color: theme.colors.error,
  },
  disabledContainer: {
    backgroundColor: theme.colors.surfaceDisabled,
    opacity: 0.5,
  },
});

const ARListNotifications = () => {
  const [pollenSpecies, setPollenSpecies] = useState<PollenSettings[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [pollenGroups, setPollenGroups] = useState<string[]>([]);
  const [authorizedPermissions, setAuthorizedPermissions] =
    useState<boolean>(false);

  const { refreshNotifications } = useContext(NotificationsContext);
  const { hasPermissions } = useNotifications();
  const { setAllPollenNotificationsToTrue, getToken } =
    useContext(NotificationsContext);

  useOnForegroundFocus(() => {
    checkPermissions();
  }, true);

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authorizedPermissions) {
      // If authorization is true, check if this is the first launch : maybe the user
      // didn't accept notification first then accept them
      // then you need to sub to all pollen notification
      getToken().then((_token: string) => {
        setToken(_token);
        getIsFirstNotificationLaunched(setAllPollenNotificationsToTrue).then(
          () => updatePollens(_token),
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorizedPermissions]);

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
    updatePollens(token);
  }, [token]);

  const updatePollens = (_token: string) => {
    setLoading(true);
    getPollenSettings(_token)
      .then(setPollenSpecies)
      .finally(() => {
        setLoading(false);
      });
  };

  const checkPermissions = () => {
    hasPermissions().then(permission => {
      setAuthorizedPermissions(
        permission === firebase.messaging.AuthorizationStatus.AUTHORIZED,
      );
      getToken().then(token => {
        setToken(token);
      });
    });
  };

  const setPollenValue = (pollen: PollenSettings) => {
    if (!pollenSpecies || !token) {
      return;
    }
    setLoading(true);
    savePollenSettings(pollen, token)
      .then(setPollenSpecies)
      .finally(() => {
        setLoading(false);
        refreshNotifications();
      });
  };

  const handleActivateNotification = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };
  return (
    <>
      <ARCommonHeader
        headline="Mes Notifications"
        left={<BackButton />}
        caption="Retrouvez ici la gestion de vos alertes"
      />
      {!authorizedPermissions && (
        <View style={styles.errorContainer}>
          <Pressable onPress={handleActivateNotification}>
            <Text style={styles.errorMessage}>Activer les notifications</Text>
          </Pressable>
        </View>
      )}
      <SafeAreaView
        style={[
          styles.container,
          !authorizedPermissions && styles.disabledContainer,
        ]}>
        {loading && <ActivityIndicator />}
        <ScrollView>
          {pollenSpecies &&
            pollenGroups.map(group => (
              <ARListPollenGroup
                key={group}
                pollens={pollenSpecies}
                groupName={group}
                setPollenValue={setPollenValue}
                loading={loading}
                authorizedPermissions={authorizedPermissions}
              />
            ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ARListNotifications;
