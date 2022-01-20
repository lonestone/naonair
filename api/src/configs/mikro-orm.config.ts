import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as dotenv from 'dotenv';

dotenv.config();

const config: MikroOrmModuleSyncOptions = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  type: 'postgresql',
  clientUrl: process.env.ORM_URL,
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
