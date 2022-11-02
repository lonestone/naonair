import * as Sentry from '@sentry/react-native';

export default {
  error: (exception: any, fromFunction?: string) => {
    if (__DEV__) {
      console.info(fromFunction, exception);
    } else {
      Sentry.captureException(exception);
    }
  },
};
