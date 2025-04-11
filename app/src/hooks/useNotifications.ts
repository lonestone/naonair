import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { requestTrackingPermission } from 'react-native-tracking-transparency';

export const useNotifications = () => {
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      return fcmToken;
    } catch (e) {
      console.error(`Error while getting fcm token => ${e}`);
      return null;
    }
  };

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      // iOS: Demander la permission de tracking (ATT) et les notifications
      try {
        // Demande de permission de tracking (ATT)
        const trackingStatus = await requestTrackingPermission();
        console.info('Tracking permission status:', trackingStatus);

        // Demande de permission pour les notifications
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.info('AuthorizationStatus for FCM enabled');
        } else {
          console.warn('AuthorizationStatus NOT enabled. Check the permissions');
        }
      } catch (error) {
        console.error('Error requesting iOS permissions:', error);
      }
    } else if (Platform.OS === 'android') {
      // Android: Seulement la demande de permission pour les notifications
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {
        console.error('Error requesting Android notification permission:', error);
      }
    }
  };

  const notificationListener = () => {
    const messages = messaging();
    messages.onNotificationOpenedApp(remoteMessage => {
      console.info(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Quiet and Background State -> Check whether an initial notification is available
    messages
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
    messages.onMessage(async remoteMessage => {
      console.info('foreground', remoteMessage);
    });
  };

  const hasPermissions = async () => {
    return await messaging().hasPermission();
  };

  return {
    getFcmToken,
    requestUserPermission,
    notificationListener,
    hasPermissions,
  };
};
