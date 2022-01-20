import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  ormSync: process.env.ORM_SYNC === 'true' || false,
  ormUrl: process.env.ORM_URL,
}));
