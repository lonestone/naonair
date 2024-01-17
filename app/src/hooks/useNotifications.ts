import messaging from '@react-native-firebase/messaging';

export const useNotifications = () => {
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      // console.info(newFcmToken);
      return fcmToken;
    } catch (e) {
      console.error(`Error while getting fcm token => ${e}`);
      return null;
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    enabled
      ? console.info('AuthorizationStatus for FCM enabled')
      : console.warn('AuthorizationStatus NOT enabled. Check the permissions');
  };

  const notificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.info(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Quiet and Background State -> Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.info(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      })
      .catch(error => console.error('Failed to get Remote message', error));

    // Foreground State
    messaging().onMessage(async remoteMessage => {
      console.info('foreground', remoteMessage);
    });
  };

  return {
    getFcmToken,
    requestUserPermission,
    notificationListener,
  };
};
