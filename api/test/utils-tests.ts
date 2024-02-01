// don't remove this import, and keep it in first line
import {
  INestApplication,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing/test';
import 'reflect-metadata';
import { AppController } from 'src/app.controller';
import appConfig from 'src/configs/app.config';
import authConfig from 'src/configs/auth.config';
import ormConfig from 'src/configs/orm.config';
import { LoggingInterceptor } from 'src/interceptors/log.interceptors';
import { AlertsModule } from 'src/modules/alerts/alerts.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { NewsModule } from 'src/modules/news/news.module';
import { OrmModule } from 'src/modules/orm/orm.module';
import { PollenModule } from 'src/modules/pollen/pollen.module';
import { DateInDTOConversionPipe } from 'src/pipes/DateInDTOConversion.pipe';
import * as request from 'supertest';

export const removeUuid = (data: any) => {
  delete data.uuid;
  return data;
};

export const initTestApp = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.tests',
        load: [ormConfig, appConfig, authConfig],
      }),
      OrmModule,
      AuthModule,
      NewsModule,
      AlertsModule,
      PollenModule,
    ],
    controllers: [AppController],
  }).compile();

  const app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalPipes(new DateInDTOConversionPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.init();
  return app;
};

export const getToken = async (app: INestApplication) => {
  if (!app) {
    console.error(
      'You must init testing app with initTestApp() to get token ! ',
    );
    throw new InternalServerErrorException();
  }
  // get JWT token
  const res = await request(app.getHttpServer())
    .post('/login')
    .send({ token: process.env.PASS_KEY })
    .expect(201);
  return res.body.access_token;
};
