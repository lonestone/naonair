import React from 'react';
import { ScrollView, View } from 'react-native';
import { Paragraph } from 'react-native-paper';
import ARSnackbar from '../atoms/ARSnackbar';
import BackButton from '../molecules/ARBackButton';
import ARCommonHeader from '../molecules/ARCommonHeader';

const ARListNotifications = () => {
  return (
    <>
      <ARCommonHeader
        headline="Mes Notifications"
        left={<BackButton />}
        caption="Retrouvez ici la gestion de vos alertes"
      />
      <ARSnackbar />
      <ScrollView>
        <View>
          <Paragraph>Bla</Paragraph>
        </View>
      </ScrollView>
    </>
  );
};

export default ARListNotifications;
