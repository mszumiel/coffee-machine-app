import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CoffeeController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/coffee/1/status (GET)', () => {
    return request(app.getHttpServer())
      .get('/coffee/1/status')
      .expect(200)
      .expect({
          id: '1',
          status: 'NOT_ORDERED',
      });
  });

  it('/coffee/2/order (POST)', () => {
    return request(app.getHttpServer())
      .post('/coffee/2/order')
      .expect(201);
  });

  it('/coffee/2/status (GET)', () => {
    return request(app.getHttpServer())
      .get('/coffee/2/status')
      .expect(200)
      .expect({
        id: 2,
        status: 'IN_PROGRESS',
      });
  });

});
