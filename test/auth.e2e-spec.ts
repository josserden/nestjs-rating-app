import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import * as request from 'supertest';

import { AuthDto } from '../src/auth/dto/auth.dto';
import { AppModule } from './../src/app.module';

const userDto: AuthDto = {
  login: 'd-h112@ukr.net',
  password: '123456',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - fail - wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        ...userDto,
        password: '2',
      })
      .expect(401, {
        message: 'Wrong password',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('/auth/login (POST) - fail - user not found', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        ...userDto,
        login: '2@mail.com',
      })
      .expect(401, {
        message: 'User with this email not found',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
