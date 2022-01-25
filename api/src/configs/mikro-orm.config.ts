import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

/**
 * Mikro-orm specific config, passed during initialiation
 */
const config: MikroOrmModuleSyncOptions = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  type: 'postgresql',
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
