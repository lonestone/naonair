import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider } from 'react-native-paper';
import ARCommonHeader from '@molecules/ARCommonHeader';
import ARListPollens from '@templates/ARListPollens';
import { NotificationsContext } from '@contexts/notifications.context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const PollensScreen = () => {
  const { readNotifications } = useContext(NotificationsContext);

  useEffect(() => {
    readNotifications();
  }, []);

  useFocusEffect(() => {
    readNotifications();
  });

  return (
    <Provider>
      <ARCommonHeader
        headline="Émissions de pollens"
        caption="Données du pollinarium sentinelle de Nantes"
      />
      <SafeAreaView style={styles.container}>
        <ARListPollens />
      </SafeAreaView>
    </Provider>
  );
};

export default PollensScreen;
