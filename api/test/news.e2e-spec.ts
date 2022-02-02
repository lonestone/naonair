import { INestApplication } from '@nestjs/common';
import { NewsEntity } from 'src/entities/news.entity';
import { OrmModule } from 'src/modules/orm/orm.module';
import * as request from 'supertest';
import { createNewsDTO, newsDTO, updateNewsDTO, wrongDTO } from './data-tests';
import { getToken, initTestApp, removeUuid } from './utils-tests';

describe('News', () => {
  let app: INestApplication;
  let ormModule: OrmModule;
  let newsEntityMock: NewsEntity;
  let jwtToken: string;

  beforeAll(async () => {
    app = await initTestApp();
    // await app.init();

    // initial mocking
    ormModule = app.get(OrmModule);
    newsEntityMock = await ormModule.getOrm().em.create(NewsEntity, newsDTO);
    await ormModule.getOrm().em.persistAndFlush(newsEntityMock);

    // get JWT token
    jwtToken = await getToken(app);
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
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(201);
    expect(removeUuid(res.body)).toEqual(createNewsDTO);
  });

  it('PATCH /news/:id', async () => {
    const res = await request(app.getHttpServer())
      .patch('/news/' + newsEntityMock.uuid)
      .send(updateNewsDTO)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + jwtToken)
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
      .get('/news/' + 13215648) // wrong uuid
      .expect(400); // bad request
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
      .patch('/news/' + 56 + 451)
      .send(createNewsDTO)
      .set('Accept', 'application/json')
      .expect(400);

    request(app.getHttpServer())
      .patch('/news/' + newsEntityMock.uuid)
      .send(wrongDTO)
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('DELETE /news/:id - validation params', async () => {
    request(app.getHttpServer())
      .delete('/news/' + 454551)
      .expect(400);
  });

  /**
   * Business logic validation tests
   */
  it('POST /news/:id - check business logic', async () => {
    // RULE 1 : cannot start in past
    request(app.getHttpServer())
      .post('/news')
      .send({ ...createNewsDTO, startDate: '2011-01-26' })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(400);

    // RULE 2 : cannot end in past
    request(app.getHttpServer())
      .post('/news')
      .send({ ...createNewsDTO, endDate: '2011-01-26' })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(400);

    // RULE 3 : if exist a current news, start date of incoming news cannot be before
    // end date of current news
    request(app.getHttpServer())
      .post('/news')
      .send({ ...createNewsDTO, startDate: '2026-12-12' })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(400);

    // RULE 4 : it could be have only 1 planned new
    // (reusing news created in POST test, in 2040)
    request(app.getHttpServer())
      .post('/news')
      .send({ ...createNewsDTO, startDate: '2041-01-26' })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
