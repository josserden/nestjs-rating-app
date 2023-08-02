import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { disconnect, Types } from 'mongoose';
import * as request from 'supertest';

import { AuthDto } from '../src/auth/dto/auth.dto';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AppModule } from './../src/app.module';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
  login: 'd-h112@ukr.net',
  password: '123456',
};

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Title',
  description: 'Description',
  rating: 5,
  productId,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    token = body.access_token;
  });

  it('/review/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;

        expect(createdId).toBeDefined();
      });
  });

  it('/review/create (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({
        ...testDto,
        rating: 0,
      })
      .expect(400)
      .then(({ body }: request.Response) => {
        console.log('body', body);
      });
  });

  // it('/review/byProduct/:productId (GET)', async () => {
  //   return request(app.getHttpServer())
  //     .get('/review/byProduct/' + productId)
  //     .set('Authorization', 'Bearer ' + token)
  //     .expect(200)
  //     .then(({ body }: request.Response) => {
  //       expect(body.length).toBe(1);
  //     });
  // });

  it('/review/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .send(testDto)
      .expect(200)
      .then((req: request.Response) => {
        expect(createdId).toBeDefined();
      });
  });

  it('/review/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
