import { registerAs } from '@nestjs/config';

/**
 * Generic orm config, which can used in app
 * It is not specific to mikro-orm
 */
export default registerAs('orm', () => ({
  /**
   * Permits to sync entities with DB
   * DON'T USE IT IN PRODUCTION ! Please, use migration
   */
  sync: ['true', '1'].includes(process.env.ORM_SYNC || '') || false,
  dropDB: ['true', '1'].includes(process.env.ORM_DROP_DB || '') || false,
  clientUrl: process.env.ORM_URL,
}));
