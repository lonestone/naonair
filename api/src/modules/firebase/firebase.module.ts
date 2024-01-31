import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';

import * as firebaseAdmin from 'firebase-admin';

import { ConfigService } from '@nestjs/config';
import { FirebaseService } from './firebase.service';

@Module({
  exports: [FirebaseService],
  providers: [FirebaseService],
})
export class FirebaseModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(FirebaseModule.name);

  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap() {
    try {
      const firebaseConfig =
        this.configService.get('NODE_ENV') === 'production'
          ? await require('/etc/secrets/firebase.json')
          : await require('../../../firebase.json');

      this.logger.log(`Firebase project ${firebaseConfig.project_id}`);

      await firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseConfig),
      });
    } catch (err) {
      this.logger.warn(`Firebase fail to init`, err);
    }
  }
}
