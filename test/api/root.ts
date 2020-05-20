import * as request from 'supertest';
import app from '../../src';

export default () =>
  describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
      request(app)
        .get('/')
        .then((response) => {
          expect(response.status).toBe(404);
          done();
        });
    });
  });
