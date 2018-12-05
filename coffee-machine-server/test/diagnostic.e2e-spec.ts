import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('DiagnosticController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/diagnostic/status (GET)', () => {
    return request(app.getHttpServer())
      .get('/diagnostic/status')
      .expect(200)
      .expect({
          coffeePreparationInProgress: false,
          cleaningInProgress: false,
          waterTankEmpty: false,
          coffeeBeansContainerEmpty: false,
          coffeeGroundsContainerFull: false,
      });
  });
});
