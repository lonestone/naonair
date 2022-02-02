import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestApp } from './utils-tests';

describe('News', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initTestApp();
    await app.init();
  });

  it('GET /alerts', async () => {
    const res = await request(app.getHttpServer()).get('/alerts').expect(200);
    expect(res.body).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
