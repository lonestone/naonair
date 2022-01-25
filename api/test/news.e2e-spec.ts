import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing/test';
import appConfig from 'src/configs/app.config';
import ormConfig from 'src/configs/orm.config';
import { NewsEntity } from 'src/entities/news.entity';
import { OrmModule } from 'src/modules/orm/orm.module';
import * as request from 'supertest';
import { NewsModule } from '../src/modules/news/news.module';
import { news } from './test-data';
import { removeUuid } from './utils-tests';

describe('News', () => {
  let app: INestApplication;
  let ormModule: OrmModule;

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
    const newsEntity = await ormModule.getOrm().em.create(NewsEntity, news);
    await ormModule.getOrm().em.persistAndFlush(newsEntity);
  });

  it('GET /news', async () => {
    const res = await request(app.getHttpServer()).get('/news').expect(200);
    expect(res.body.map((r) => removeUuid(r))).toEqual([news]);
  });

  it('POST /news', () => {
    return request(app.getHttpServer())
      .post('/news')
      .send(news)
      .set('Accept', 'application/json')
      .expect(201);
    // .expect({ data: news });
  });

  afterAll(async () => {
    await app.close();
  });
});
