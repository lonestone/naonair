import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing/test';
import appConfig from 'src/configs/app.config';
import ormConfig from 'src/configs/orm.config';
import { NewsEntity } from 'src/entities/news.entity';
import { OrmModule } from 'src/modules/orm/orm.module';
import * as request from 'supertest';
import { NewsModule } from '../src/modules/news/news.module';
import { createNewsDTO, newsDTO, updateNewsDTO, wrongDTO } from './test-data';
import { removeUuid } from './utils-tests';

describe('News', () => {
  let app: INestApplication;
  let ormModule: OrmModule;
  let newsEntityMock: NewsEntity;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.tests',
          load: [ormConfig, appConfig],
        }),
        OrmModule,
        NewsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    ormModule = app.get(OrmModule);
    await app.init();

    // initial mocking
    newsEntityMock = await ormModule.getOrm().em.create(NewsEntity, newsDTO);
    await ormModule.getOrm().em.persistAndFlush(newsEntityMock);
  });

  /**
   * Nominal tests
   */

  it('GET /news', async () => {
    const res = await request(app.getHttpServer()).get('/news').expect(200);
    expect(res.body).toEqual([newsEntityMock]);
  });

  it('GET /news/:id', async () => {
    const res = await request(app.getHttpServer())
      .get('/news/' + newsEntityMock.uuid)
      .expect(200);
    expect(res.body).toEqual(newsEntityMock);
  });

  it('POST /news', async () => {
    const res = await request(app.getHttpServer())
      .post('/news')
      .send(createNewsDTO)
      .set('Accept', 'application/json')
      .expect(201);
    expect(removeUuid(res.body)).toEqual(createNewsDTO);
  });

  it('PATCH /news/:id', async () => {
    const res = await request(app.getHttpServer())
      .patch('/news/' + newsEntityMock.uuid)
      .send(updateNewsDTO)
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).toEqual({ ...updateNewsDTO, uuid: newsEntityMock.uuid });
  });

  it('DELETE /news/:id', async () => {
    request(app.getHttpServer())
      .delete('/news/' + newsEntityMock.uuid)
      .expect(204);

    // check entity is really deleted
    request(app.getHttpServer())
      .get('/news/' + newsEntityMock.uuid)
      .expect(404);
  });

  /**
   * Args validation tests
   */
  it('GET /news/:id - validation params', async () => {
    request(app.getHttpServer())
      .get('/news/' + 1)
      .expect(400);
  });

  it('POST /news - validation body', async () => {
    request(app.getHttpServer())
      .post('/news')
      .send(wrongDTO)
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('PATCH /news/:id - validation params/body', async () => {
    request(app.getHttpServer())
      .patch('/news/' + newsEntityMock.uuid)
      .send(wrongDTO)
      .set('Accept', 'application/json')
      .expect(400);

    request(app.getHttpServer())
      .patch('/news/' + 1)
      .send(createNewsDTO)
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('DELETE /news/:id - validation params', async () => {
    request(app.getHttpServer())
      .delete('/news/' + 1)
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
