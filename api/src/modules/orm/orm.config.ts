import { registerAs } from '@nestjs/config';

/**
 * Permits to sync entities with DB
 * DON'T USE IT IN PRODUCTION ! Please, use migration
 */
export default registerAs('orm', () => ({
  sync: ['true', '1'].includes(process.env.ORM_SYNC || '') || false,
}));
