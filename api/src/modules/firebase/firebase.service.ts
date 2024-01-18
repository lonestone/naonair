import { Injectable, Logger } from '@nestjs/common';

import * as firebaseAdmin from 'firebase-admin';
import { BadTokenError } from 'src/errors/bad-token.error';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  skipFirebase() {
    return firebaseAdmin.apps.length === 0;
  }

  async sendPushNotification(token: string, title: string, body: string) {
    if (this.skipFirebase()) {
      return;
    }

    try {
      await firebaseAdmin
        .messaging()
        .send({
          notification: {
            title,
            body,
          },
          data: {},
          token,
        })
        .then(() => {
          this.logger.debug(`Send pushNotification - title: ${title}`);
        });
    } catch (error) {
      await this.handlePushNotificationError(error, token);
    }
  }

  async handlePushNotificationError(
    error: firebaseAdmin.FirebaseError,
    token: string,
  ) {
    switch (error.code) {
      case 'messaging/invalid-argument':
      case 'messaging/registration-token-not-registered':
        throw new BadTokenError('Token not found', token);
      default:
        console.log('Error sending message:', error);
        throw error;
    }
  }
}
