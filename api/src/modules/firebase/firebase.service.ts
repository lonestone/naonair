import { Injectable, Logger } from '@nestjs/common';

import * as firebaseAdmin from 'firebase-admin';
import {
  DataMessagePayload,
  NotificationMessagePayload,
} from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  skipFirebase() {
    return firebaseAdmin.apps.length === 0;
  }

  sendPushNotification(
    token: string,
    notification: NotificationMessagePayload,
    data: DataMessagePayload,
  ) {
    this.logger.debug(`Send pushNotification - title: ${notification.title}`);

    if (this.skipFirebase()) {
      return;
    }

    return firebaseAdmin.messaging().sendToDevice(token, {
      notification,
      data,
    });
  }
}
