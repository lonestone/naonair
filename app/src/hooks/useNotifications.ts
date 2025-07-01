import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { requestTrackingPermission, getTrackingStatus } from 'react-native-tracking-transparency';

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
      try {
        // Vérifier d'abord le statut actuel
        const currentStatus = await getTrackingStatus();

        // Si le statut est "not-determined", attendre un court délai avant de demander
        if (currentStatus === 'not-determined') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const trackingStatus = await requestTrackingPermission();
          console.info('Tracking permission status:', trackingStatus);
        }

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
      // Android: Demande de permission pour les notifications (Android 13+)
      try {
        // Vérifier si on est sur Android 13+ (API level 33+)
        if (Platform.Version >= 33) {
          // Vérifier d'abord si la permission est déjà accordée
          const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          if (!hasPermission) {
            const result = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
              {
                title: 'Permission de notifications',
                message: 'Cette application a besoin d\'accéder aux notifications pour vous informer des alertes qualité de l\'air.',
                buttonNeutral: 'Demander plus tard',
                buttonNegative: 'Annuler',
                buttonPositive: 'OK',
              }
            );

            if (result === PermissionsAndroid.RESULTS.GRANTED) {
              console.info('Permission de notifications accordée');
            } else {
              console.warn('Permission de notifications refusée');
            }
          } else {
            console.info('Permission de notifications déjà accordée');
          }
        } else {
          console.info('Android < 13: Pas besoin de permission POST_NOTIFICATIONS');
        }

        // Demande de permission FCM (nécessaire pour tous les versions Android)
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
