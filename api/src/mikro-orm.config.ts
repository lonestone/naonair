import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

/**
 * Mikro-orm specific config, passed during initialiation
  dbName and clientUrl properties are used for migrations
 * 
 */
const config: MikroOrmModuleSyncOptions = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  type: 'postgresql',
  metadataProvider: TsMorphMetadataProvider,
  dbName: process.env.ORM_DB ,
  clientUrl: process.env.ORM_URL,
};

export default config;
